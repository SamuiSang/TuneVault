using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.DTOs;
using TuneVault.Application.Features.Notifications.Queries.GetUserNotifications;

namespace TuneVault.Application.Features.Notifications.Queries;

/// <summary>
/// Handler cho GetUserNotificationsQuery
/// Lấy danh sách thông báo của user từ database
/// </summary>
public class GetUserNotificationsQueryHandler : IRequestHandler<GetUserNotificationsQuery, BaseResponse<GetNotificationsResponseDto>>
{
    private readonly INotificationRepository _notificationRepository;

    public GetUserNotificationsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<BaseResponse<GetNotificationsResponseDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Lấy tất cả thông báo của user từ database
            var notifications = await _notificationRepository.GetUserNotificationsAsync(
                request.UserId,
                cancellationToken);

            // 2. Lấy số lượng thông báo chưa đọc
            var unreadNotifications = await _notificationRepository.GetUnreadNotificationsAsync(
                request.UserId,
                cancellationToken);

            // 3. Map repository response sang DTOs
            var notificationDtos = notifications.Select(n => new NotificationDto(
                Id: n.Id,
                Type: n.Type,
                PayloadJson: n.PayloadJson,
                IsRead: n.IsRead,
                CreatedAt: n.CreatedAt,
                UserId: n.UserId
            )).ToList();

            // 4. Tạo response object
            var response = new GetNotificationsResponseDto(
                Notifications: notificationDtos,
                UnreadCount: unreadNotifications.Count,
                RetrievedAt: DateTime.UtcNow
            );

            return new BaseResponse<GetNotificationsResponseDto>(
                data: response,
                success: true,
                message: $"Lấy {notifications.Count} thông báo thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<GetNotificationsResponseDto>(
                message: $"Lỗi khi lấy thông báo: {ex.Message}"
            );
        }
    }
}
