using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.Commands.MarkAsRead;

namespace TuneVault.Application.Features.Notifications.Commands;

/// <summary>
/// Handler cho MarkNotificationAsReadCommand
/// Cập nhật trạng thái thông báo thành "đã đọc"
/// </summary>
public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand, BaseResponse<bool>>
{
    private readonly INotificationRepository _notificationRepository;

    public MarkNotificationAsReadCommandHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<BaseResponse<bool>> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Gọi repository để đánh dấu notification là đã đọc
            var result = await _notificationRepository.MarkAsReadAsync(
                request.NotificationId,
                cancellationToken);

            if (!result)
            {
                return new BaseResponse<bool>(
                    message: "Không tìm thấy thông báo để cập nhật!"
                );
            }

            return new BaseResponse<bool>(
                data: true,
                success: true,
                message: "Đánh dấu thông báo đã đọc thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<bool>(
                message: $"Lỗi khi đánh dấu thông báo: {ex.Message}"
            );
        }
    }
}
