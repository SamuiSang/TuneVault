namespace TuneVault.Application.Features.Notifications.DTOs;

/// <summary>
/// DTO cho payload của thông báo - chứa dữ liệu cụ thể của notification
/// Ví dụ: khi chia sẻ media, payload chứa thông tin media và sender
/// </summary>
public record NotificationPayloadDto(
    string Type, // "MediaShared", "PlaylistShared", "CommentLiked", etc.
    Guid? MediaItemId = null,
    Guid? PlaylistId = null,
    string? SenderName = null,
    string? SenderId = null,
    string? Message = null,
    DateTime? Timestamp = null
);
