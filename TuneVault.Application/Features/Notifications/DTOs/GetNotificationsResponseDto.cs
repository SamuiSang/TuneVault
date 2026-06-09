namespace TuneVault.Application.Features.Notifications.DTOs;

/// <summary>
/// DTO cho response khi lấy danh sách thông báo
/// </summary>
public record GetNotificationsResponseDto(
    List<NotificationDto> Notifications,
    int UnreadCount,
    DateTime RetrievedAt
);
