using MediatR;
using System.Text.Json;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.Commands.CreateNotification;

namespace TuneVault.Application.Features.Notifications.Commands;

/// <summary>
/// Handler cho CreateNotificationCommand
/// Lưu thông báo vào database và đẩy real-time qua SignalR
/// </summary>
public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, BaseResponse<Guid>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationService _notificationService;

    public CreateNotificationCommandHandler(
        INotificationRepository notificationRepository,
        INotificationService notificationService)
    {
        _notificationRepository = notificationRepository;
        _notificationService = notificationService;
    }

    public async Task<BaseResponse<Guid>> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var notificationRequest = new CreateNotificationRequest(
                UserId: request.UserId,
                Type: request.Type,
                PayloadJson: request.PayloadJson,
                IsRead: false
            );

            var notificationId = await _notificationRepository.CreateNotificationAsync(
                notificationRequest,
                cancellationToken);

            var payload = JsonSerializer.Deserialize<object>(request.PayloadJson) ?? request.PayloadJson;

            await _notificationService.SendNotificationToUserAsync(
                request.UserId,
                request.Type,
                new
                {
                    id = notificationId,
                    type = request.Type,
                    payload,
                    payloadJson = request.PayloadJson,
                    createdAt = DateTime.UtcNow
                },
                cancellationToken);

            return new BaseResponse<Guid>(
                data: notificationId,
                success: true,
                message: "Thông báo được tạo thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<Guid>(
                message: $"Lỗi khi tạo thông báo: {ex.Message}"
            );
        }
    }
}
