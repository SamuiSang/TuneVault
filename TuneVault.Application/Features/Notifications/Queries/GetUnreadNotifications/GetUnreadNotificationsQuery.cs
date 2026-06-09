using MediatR;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.DTOs;

namespace TuneVault.Application.Features.Notifications.Queries.GetUnreadNotifications;

/// <summary>
/// Query để lấy danh sách thông báo chưa đọc của một user
/// </summary>
public record GetUnreadNotificationsQuery(string UserId) : IRequest<BaseResponse<List<NotificationDto>>>;
