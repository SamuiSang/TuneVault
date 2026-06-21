using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Infrastructure.SignalR;

/// <summary>
/// Implementation của INotificationService sử dụng SignalR
/// Gửi real-time notifications tới clients
/// </summary>
public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(IHubContext<NotificationHub> hubContext, ILogger<NotificationService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    /// <summary>
    /// Gửi notification tới một user cụ thể
    /// </summary>
    public async Task SendNotificationToUserAsync(
        string userId,
        string notificationType,
        object payload,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var groupName = $"user_{userId}";

            // Serialize payload thành JSON
            var payloadJson = JsonSerializer.Serialize(payload);

            // Tạo notification object
            var notification = new
            {
                type = notificationType,
                payload = payload,
                payloadJson = payloadJson,
                sentAt = DateTime.UtcNow,
                userId = userId
            };

            // Gửi notification tới group "user_{userId}"
            await _hubContext.Clients
                .Group(groupName)
                .SendAsync("ReceiveNotification", notification, cancellationToken);

            _logger.LogInformation(
                $"[SignalR] Sent notification to user {userId} | Type: {notificationType}");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                $"[SignalR] Error sending notification to user {userId}: {ex.Message}");
            throw;
        }
    }
    
    public async Task CreateNotificationAsync(string userId, string message, string type)
    {
        // Gọi đến hàm gửi thông báo SignalR đã có sẵn trong class
        await SendNotificationToUserAsync(userId, type, new 
        { 
            message = message,
            createdAt = DateTime.UtcNow 
        });
    }
    /// <summary>
    /// Gửi notification tới nhiều users
    /// </summary>
    public async Task SendNotificationToMultipleUsersAsync(
        IEnumerable<string> userIds,
        string notificationType,
        object payload,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var userIdList = userIds.ToList();

            // Serialize payload thành JSON
            var payloadJson = JsonSerializer.Serialize(payload);

            // Tạo notification object
            var notification = new
            {
                type = notificationType,
                payload = payload,
                payloadJson = payloadJson,
                sentAt = DateTime.UtcNow
            };

            // Gửi notification tới mỗi user
            foreach (var userId in userIdList)
            {
                var groupName = $"user_{userId}";
                await _hubContext.Clients
                    .Group(groupName)
                    .SendAsync("ReceiveNotification", notification, cancellationToken);
            }

            _logger.LogInformation(
                $"[SignalR] Sent notification to {userIdList.Count} users | Type: {notificationType}");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                $"[SignalR] Error sending notification to multiple users: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Broadcast notification tới tất cả users online
    /// </summary>
    public async Task BroadcastNotificationAsync(
        string notificationType,
        object payload,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Serialize payload thành JSON
            var payloadJson = JsonSerializer.Serialize(payload);

            // Tạo notification object
            var notification = new
            {
                type = notificationType,
                payload = payload,
                payloadJson = payloadJson,
                sentAt = DateTime.UtcNow,
                isBroadcast = true
            };

            // Gửi tới tất cả clients
            await _hubContext.Clients
                .All
                .SendAsync("ReceiveNotification", notification, cancellationToken);

            _logger.LogInformation(
                $"[SignalR] Broadcasted notification | Type: {notificationType}");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                $"[SignalR] Error broadcasting notification: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Gửi broadcast message (dùng cho testing)
    /// </summary>
    public async Task SendBroadcastMessageAsync(
        string message,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var broadcastMessage = new
            {
                message = message,
                timestamp = DateTime.UtcNow
            };

            // Gửi tới tất cả clients
            await _hubContext.Clients
                .All
                .SendAsync("ReceiveBroadcast", broadcastMessage, cancellationToken);

            _logger.LogInformation($"[SignalR] Sent broadcast message: {message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                $"[SignalR] Error sending broadcast message: {ex.Message}");
            throw;
        }
    }
}
