using System;
using System.Data;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories
{
    public class MediaShareRepository : IMediaShareRepository
    {
        private readonly IDbConnection _dbConnection;

        public MediaShareRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<Guid> CreateMediaShareAsync(CreateMediaShareRequest request, CancellationToken cancellationToken = default)
        {
            var shareId = Guid.NewGuid();
            var notificationId = Guid.NewGuid();

            // Mở kết nối trước khi bắt đầu Transaction
            if (_dbConnection.State != ConnectionState.Open)
            {
                _dbConnection.Open();
            }

            // Khởi tạo Transaction bọc cả 2 lệnh INSERT
            using var transaction = _dbConnection.BeginTransaction();

            try
            {
                // 1. Lưu lịch sử chia sẻ vào bảng MediaShare
                const string shareQuery = @"
                    INSERT INTO MediaShare (Id, SharedAt, SenderId, ReceiverId, MediaItemId, PlaylistId)
                    VALUES (@Id, @SharedAt, @SenderId, @ReceiverId, @MediaItemId, @PlaylistId)";

                await _dbConnection.ExecuteAsync(shareQuery, new
                {
                    Id = shareId,
                    SharedAt = DateTime.UtcNow,
                    request.SenderId,
                    request.ReceiverId,
                    request.MediaItemId,
                    request.PlaylistId
                }, transaction); // <-- Nhớ truyền transaction vào đây

                // 2. Tạo thông báo vào bảng Notification (Để SignalR có cái mà đọc)
                var payload = JsonSerializer.Serialize(new
                {
                    ShareId = shareId,
                    SenderId = request.SenderId,
                    MediaItemId = request.MediaItemId,
                    PlaylistId = request.PlaylistId
                });

                const string notifQuery = @"
                    INSERT INTO Notification (Id, UserId, Type, PayloadJson, IsRead, CreatedAt)
                    VALUES (@Id, @UserId, @Type, @PayloadJson, @IsRead, @CreatedAt)";

                await _dbConnection.ExecuteAsync(notifQuery, new
                {
                    Id = notificationId,
                    UserId = request.ReceiverId, // Gửi thông báo cho người nhận
                    Type = "MediaShare",
                    PayloadJson = payload,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                }, transaction); // <-- Truyền transaction vào đây nữa

                // Trót lọt cả 2 thì chốt đơn lưu vào DB
                transaction.Commit();
                return shareId;
            }
            catch
            {
                // Lỗi 1 trong 2 thì hủy bỏ toàn bộ, tránh sinh rác trong DB
                transaction.Rollback();
                throw; // Ném lỗi ra để tầng Application (Handler) bắt và trả về HTTP 500
            }
        }

        // 🌟 ĐOẠN CODE CHỐNG SPAM ĐÃ ĐƯỢC ĐỒNG BỘ HOÀN TOÀN VỚI CƠ SỞ DỮ LIỆU CỦA NHÓM:
        public async Task<bool> HasSharedInLast24HoursAsync(string senderId, string receiverId, Guid? mediaItemId, Guid? playlistId, CancellationToken cancellationToken)
        {
            // Nếu không chia sẻ media hay playlist nào thì bỏ qua
            if (mediaItemId == null && playlistId == null) return false;

            // Kiểm tra theo mediaItemId nếu có
            if (mediaItemId != null)
            {
                const string sql = @"
                    SELECT COUNT(1) 
                    FROM MediaShare 
                    WHERE SenderId = @SenderId 
                      AND ReceiverId = @ReceiverId 
                      AND MediaItemId = @MediaItemId 
                      AND SharedAt >= DATEADD(day, -1, GETDATE());";

                var count = await _dbConnection.ExecuteScalarAsync<int>(new CommandDefinition(
                    sql, 
                    new { SenderId = senderId, ReceiverId = receiverId, MediaItemId = mediaItemId }, 
                    cancellationToken: cancellationToken
                ));
                if (count > 0) return true;
            }

            // Kiểm tra theo playlistId nếu có
            if (playlistId != null)
            {
                const string sql = @"
                    SELECT COUNT(1) 
                    FROM MediaShare 
                    WHERE SenderId = @SenderId 
                      AND ReceiverId = @ReceiverId 
                      AND PlaylistId = @PlaylistId 
                      AND SharedAt >= DATEADD(day, -1, GETDATE());";

                var count = await _dbConnection.ExecuteScalarAsync<int>(new CommandDefinition(
                    sql, 
                    new { SenderId = senderId, ReceiverId = receiverId, PlaylistId = playlistId }, 
                    cancellationToken: cancellationToken
                ));
                if (count > 0) return true;
            }

            return false;
        }

        public async Task<bool> IsPlaylistSharedWithUserAsync(Guid playlistId, string userId, CancellationToken cancellationToken = default)
        {
            const string sql = @"
                SELECT COUNT(1) 
                FROM MediaShare 
                WHERE PlaylistId = @PlaylistId 
                  AND ReceiverId = @ReceiverId;";
            
            var count = await _dbConnection.ExecuteScalarAsync<int>(new CommandDefinition(
                sql, 
                new { PlaylistId = playlistId, ReceiverId = userId }, 
                cancellationToken: cancellationToken
            ));

            return count > 0;
        }

        public async Task<bool> DeleteSharedItemsAsync(string receiverId, IEnumerable<Guid> shareIds, CancellationToken cancellationToken = default)
        {
            if (shareIds == null || !shareIds.Any()) return false;
            const string sql = "DELETE FROM MediaShare WHERE ReceiverId = @ReceiverId AND Id IN @ShareIds";
            var affected = await _dbConnection.ExecuteAsync(new CommandDefinition(sql, new { ReceiverId = receiverId, ShareIds = shareIds }, cancellationToken: cancellationToken));
            return affected > 0;
        }
    }
}