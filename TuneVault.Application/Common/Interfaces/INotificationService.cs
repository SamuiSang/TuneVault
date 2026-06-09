namespace TuneVault.Application.Common.Interfaces;

/// <summary>
/// Interface cho Notification Service
/// Dùng để gửi notifications qua SignalR real-time
/// </summary>
public interface INotificationService
{
    /// <summary>
    /// Gửi notification tới một user cụ thể
    /// </summary>
    /// <param name="userId">ID của user nhận notification</param>
    /// <param name="notificationType">Type của notification</param>
    /// <param name="payload">Payload data (object sẽ được serialize thành JSON)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SendNotificationToUserAsync(string userId, string notificationType, object payload, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gửi notification tới nhiều users
    /// </summary>
    /// <param name="userIds">Danh sách ID của users nhận notification</param>
    /// <param name="notificationType">Type của notification</param>
    /// <param name="payload">Payload data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SendNotificationToMultipleUsersAsync(IEnumerable<string> userIds, string notificationType, object payload, CancellationToken cancellationToken = default);

    /// <summary>
    /// Broadcast notification tới tất cả users online
    /// </summary>
    /// <param name="notificationType">Type của notification</param>
    /// <param name="payload">Payload data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task BroadcastNotificationAsync(string notificationType, object payload, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gửi message test (dùng để kiểm tra kết nối)
    /// </summary>
    /// <param name="message">Nội dung message</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SendBroadcastMessageAsync(string message, CancellationToken cancellationToken = default);
}
