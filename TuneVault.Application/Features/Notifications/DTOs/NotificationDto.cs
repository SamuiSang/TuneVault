namespace TuneVault.Application.Features.Notifications.DTOs;

/// <summary>
/// DTO cho thông báo - dùng khi trả về cho client
/// </summary>
public record NotificationDto(
    Guid Id,
    string Type,
    string PayloadJson,
    bool IsRead,
    DateTime CreatedAt,
    string UserId
);
