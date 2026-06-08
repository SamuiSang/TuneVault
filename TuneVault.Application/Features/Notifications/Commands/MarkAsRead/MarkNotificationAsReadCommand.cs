using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Notifications.Commands.MarkAsRead;

/// <summary>
/// Command để đánh dấu một thông báo là đã đọc
/// </summary>
public record MarkNotificationAsReadCommand(Guid NotificationId) : IRequest<BaseResponse<bool>>;
