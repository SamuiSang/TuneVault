using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Notifications.Commands.CreateNotification;

/// <summary>
/// Command để tạo một thông báo mới
/// Được gọi khi có sự kiện cần notify user (chia sẻ media, follow, etc.)
/// </summary>
public record CreateNotificationCommand(
    string UserId,
    string Type,
    string PayloadJson
) : IRequest<BaseResponse<Guid>>;
