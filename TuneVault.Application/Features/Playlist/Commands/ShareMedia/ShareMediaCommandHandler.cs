using MediatR;
using System.Text.Json;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.Commands.CreateNotification;
using TuneVault.Application.Features.Notifications.DTOs;
using TuneVault.Application.Features.Playlist.Commands.ShareMedia;

namespace TuneVault.Application.Features.Playlist.Commands.ShareMedia;

/// <summary>
/// Handler chia sẻ media tới user khác, lưu MediaShare và tạo notification real-time
/// </summary>
public class ShareMediaCommandHandler : IRequestHandler<ShareMediaCommand, BaseResponse<Guid>>
{
    private readonly IMediaShareRepository _mediaShareRepository;
    private readonly IMediaRepository _mediaRepository;
    private readonly IMediator _mediator;

    public ShareMediaCommandHandler(
        IMediaShareRepository mediaShareRepository,
        IMediaRepository mediaRepository,
        IMediator mediator)
    {
        _mediaShareRepository = mediaShareRepository;
        _mediaRepository = mediaRepository;
        _mediator = mediator;
    }

    public async Task<BaseResponse<Guid>> Handle(ShareMediaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var media = await _mediaRepository.GetMediaByIdAsync(request.MediaId, cancellationToken);
            if (media == null)
            {
                return new BaseResponse<Guid>(message: "Không tìm thấy media để chia sẻ!");
            }

            var shareId = await _mediaShareRepository.CreateMediaShareAsync(
                new CreateMediaShareRequest(
                    SenderId: request.SenderId,
                    ReceiverId: request.ReceiverId,
                    MediaItemId: request.MediaId),
                cancellationToken);

            var payload = new NotificationPayloadDto(
                Type: "MediaShared",
                MediaItemId: request.MediaId,
                SenderId: request.SenderId,
                Message: $"Đã chia sẻ media \"{media.Title}\" với bạn",
                Timestamp: DateTime.UtcNow
            );

            var payloadJson = JsonSerializer.Serialize(payload);

            var notificationResult = await _mediator.Send(
                new CreateNotificationCommand(request.ReceiverId, "MediaShared", payloadJson),
                cancellationToken);

            if (!notificationResult.Success)
            {
                return new BaseResponse<Guid>(message: notificationResult.Message);
            }

            return new BaseResponse<Guid>(
                data: shareId,
                success: true,
                message: "Chia sẻ media thành công!"
            );
        }
        catch (Exception ex)
        {
            return new BaseResponse<Guid>(message: $"Lỗi khi chia sẻ media: {ex.Message}");
        }
    }
}
