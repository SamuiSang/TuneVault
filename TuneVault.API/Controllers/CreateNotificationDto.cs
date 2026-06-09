namespace TuneVault.API.Controllers;

/// <summary>
/// Request DTO để tạo thông báo mới
/// </summary>
public record CreateNotificationDto(
    string UserId,
    string Type,
    string PayloadJson
);
