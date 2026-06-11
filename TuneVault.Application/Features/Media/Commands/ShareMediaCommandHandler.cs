using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Media.Commands
{
    public class ShareMediaCommandHandler : IRequestHandler<ShareMediaCommand, Guid>
    {
        private readonly IMediaShareRepository _mediaShareRepository;

        public ShareMediaCommandHandler(IMediaShareRepository mediaShareRepository)
        {
            _mediaShareRepository = mediaShareRepository;
        }

        public async Task<Guid> Handle(ShareMediaCommand request, CancellationToken cancellationToken)
        {
            // Khởi tạo Request từ dữ liệu của Command gửi lên
            var repoRequest = new CreateMediaShareRequest(
                request.SenderId,
                request.ReceiverId,
                request.MediaItemId,
                request.PlaylistId
            );

            // Gọi Repository xử lý lưu DB + tạo Notification cùng lúc thông qua Transaction
            var shareId = await _mediaShareRepository.CreateMediaShareAsync(repoRequest, cancellationToken);

            // Trả về ID của lượt chia sẻ để API Controller phản hồi về cho Client
            return shareId;
        }
    }
}