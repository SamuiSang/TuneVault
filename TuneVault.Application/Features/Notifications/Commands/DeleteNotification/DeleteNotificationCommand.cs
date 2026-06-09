using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Notifications.Commands.DeleteNotification;

/// <summary>
/// Command để xóa một thông báo
/// </summary>
public record DeleteNotificationCommand(Guid NotificationId) : IRequest<BaseResponse<bool>>;
