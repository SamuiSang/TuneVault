using System.Data;
<<<<<<< HEAD
using System.Text.Json;
=======
>>>>>>> 0ca8b5a94c779c737b1f46a2b2f933bab2e5ee93
using Dapper;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories;

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
<<<<<<< HEAD
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
}
=======

        const string query = @"
            INSERT INTO MediaShare (Id, SharedAt, SenderId, ReceiverId, MediaItemId, PlaylistId)
            VALUES (@Id, @SharedAt, @SenderId, @ReceiverId, @MediaItemId, @PlaylistId)";

        await _dbConnection.ExecuteAsync(query, new
        {
            Id = shareId,
            SharedAt = DateTime.UtcNow,
            request.SenderId,
            request.ReceiverId,
            request.MediaItemId,
            request.PlaylistId
        });

        return shareId;
    }
}
>>>>>>> 0ca8b5a94c779c737b1f46a2b2f933bab2e5ee93
