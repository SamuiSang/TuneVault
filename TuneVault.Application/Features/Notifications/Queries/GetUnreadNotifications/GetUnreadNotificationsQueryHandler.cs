using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.DTOs;
using TuneVault.Application.Features.Notifications.Queries.GetUnreadNotifications;

namespace TuneVault.Application.Features.Notifications.Queries;

/// <summary>
/// Handler cho GetUnreadNotificationsQuery
/// Lấy danh sách thông báo chưa đọc của user từ database
/// </summary>
public class GetUnreadNotificationsQueryHandler : IRequestHandler<GetUnreadNotificationsQuery, BaseResponse<List<NotificationDto>>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetUnreadNotificationsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<BaseResponse<List<NotificationDto>>> Handle(GetUnreadNotificationsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Lấy tất cả thông báo chưa đọc của user từ database
            var unreadNotifications = await _notificationRepository.GetUnreadNotificationsAsync(
                request.UserId,
                cancellationToken);

            // 2. Map repository response sang DTOs
            var notificationDtos = unreadNotifications.Select(n => new NotificationDto(
                Id: n.Id,
                Type: n.Type,
                PayloadJson: n.PayloadJson,
                IsRead: n.IsRead,
                CreatedAt: n.CreatedAt,
                UserId: n.UserId
            )).ToList();

            return new BaseResponse<List<NotificationDto>>(
                data: notificationDtos,
                success: true,
                message: $"Lấy {notificationDtos.Count} thông báo chưa đọc thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<List<NotificationDto>>(
                message: $"Lỗi khi lấy thông báo chưa đọc: {ex.Message}"
            );
        }
    }
}
