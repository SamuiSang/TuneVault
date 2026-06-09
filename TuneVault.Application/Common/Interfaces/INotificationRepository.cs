namespace TuneVault.Application.Common.Interfaces.Repositories;

/// <summary>
/// Repository interface cho Notification entity
/// Quản lý các thông báo trong hệ thống
/// </summary>
public interface INotificationRepository
{
    /// <summary>
    /// Tạo mới một thông báo
    /// </summary>
    /// <param name="notification">Dữ liệu thông báo</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>ID của thông báo vừa tạo</returns>
    Task<Guid> CreateNotificationAsync(CreateNotificationRequest notification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy danh sách thông báo của một user
    /// </summary>
    /// <param name="userId">ID của user</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Danh sách thông báo</returns>
    Task<List<GetNotificationResponse>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy thông báo chưa đọc của user
    /// </summary>
    /// <param name="userId">ID của user</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Danh sách thông báo chưa đọc</returns>
    Task<List<GetNotificationResponse>> GetUnreadNotificationsAsync(string userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Đánh dấu thông báo là đã đọc
    /// </summary>
    /// <param name="notificationId">ID của thông báo</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True nếu thành công</returns>
    Task<bool> MarkAsReadAsync(Guid notificationId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Xóa thông báo
    /// </summary>
    /// <param name="notificationId">ID của thông báo</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True nếu thành công</returns>
    Task<bool> DeleteNotificationAsync(Guid notificationId, CancellationToken cancellationToken = default);
}

/// <summary>
/// Request model để tạo thông báo
/// </summary>
public record CreateNotificationRequest(
    string UserId,
    string Type,
    string PayloadJson,
    bool IsRead = false
);

/// <summary>
/// Response model cho thông báo
/// </summary>
public record GetNotificationResponse(
    Guid Id,
    string Type,
    string PayloadJson,
    bool IsRead,
    DateTime CreatedAt,
    string UserId
);
