using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories;

/// <summary>
/// Implementation của INotificationRepository sử dụng Dapper
/// </summary>
public class NotificationRepository : INotificationRepository
{
    private readonly IDbConnection _dbConnection;

    public NotificationRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    /// <summary>
    /// Tạo mới một thông báo
    /// </summary>
    public async Task<Guid> CreateNotificationAsync(CreateNotificationRequest notification, CancellationToken cancellationToken = default)
    {
        var notificationId = Guid.NewGuid();

        const string query = @"
            INSERT INTO Notification (Id, Type, PayloadJson, IsRead, CreatedAt, UserId)
            VALUES (@Id, @Type, @PayloadJson, @IsRead, @CreatedAt, @UserId)";

        var parameters = new
        {
            Id = notificationId,
            Type = notification.Type,
            PayloadJson = notification.PayloadJson,
            IsRead = notification.IsRead,
            CreatedAt = DateTime.UtcNow,
            UserId = notification.UserId
        };

        await _dbConnection.ExecuteAsync(query, parameters);
        return notificationId;
    }

    /// <summary>
    /// Lấy danh sách thông báo của một user (sắp xếp mới nhất trước)
    /// </summary>
    public async Task<List<GetNotificationResponse>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT Id, Type, PayloadJson, IsRead, CreatedAt, UserId
            FROM Notification
            WHERE UserId = @UserId
            ORDER BY CreatedAt DESC";

        var notifications = await _dbConnection.QueryAsync<GetNotificationResponse>(
            query,
            new { UserId = userId });

        return notifications.ToList();
    }

    /// <summary>
    /// Lấy danh sách thông báo chưa đọc của user
    /// </summary>
    public async Task<List<GetNotificationResponse>> GetUnreadNotificationsAsync(string userId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT Id, Type, PayloadJson, IsRead, CreatedAt, UserId
            FROM Notification
            WHERE UserId = @UserId AND IsRead = 0
            ORDER BY CreatedAt DESC";

        var notifications = await _dbConnection.QueryAsync<GetNotificationResponse>(
            query,
            new { UserId = userId });

        return notifications.ToList();
    }

    /// <summary>
    /// Đánh dấu thông báo là đã đọc
    /// </summary>
    public async Task<bool> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            UPDATE Notification
            SET IsRead = 1
            WHERE Id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, new { Id = notificationId });
        return rowsAffected > 0;
    }

    /// <summary>
    /// Xóa thông báo
    /// </summary>
    public async Task<bool> DeleteNotificationAsync(Guid notificationId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            DELETE FROM Notification
            WHERE Id = @Id";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, new { Id = notificationId });
        return rowsAffected > 0;
    }
}
