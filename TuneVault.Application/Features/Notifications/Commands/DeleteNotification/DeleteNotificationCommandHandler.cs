using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.Commands.DeleteNotification;

namespace TuneVault.Application.Features.Notifications.Commands;

/// <summary>
/// Handler cho DeleteNotificationCommand
/// Xóa thông báo khỏi database
/// </summary>
public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, BaseResponse<bool>>
{
    private readonly INotificationRepository _notificationRepository;

    public DeleteNotificationCommandHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<BaseResponse<bool>> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Gọi repository để xóa notification
            var result = await _notificationRepository.DeleteNotificationAsync(
                request.NotificationId,
                cancellationToken);

            if (!result)
            {
                return new BaseResponse<bool>(
                    message: "Không tìm thấy thông báo để xóa!"
                );
            }

            return new BaseResponse<bool>(
                data: true,
                success: true,
                message: "Xóa thông báo thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<bool>(
                message: $"Lỗi khi xóa thông báo: {ex.Message}"
            );
        }
    }
}
