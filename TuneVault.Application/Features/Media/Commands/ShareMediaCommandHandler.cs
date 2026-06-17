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
            // 🌟 1. CHỐNG SPAM: Kiểm tra xem trong vòng 24h qua đã gửi bài này cho người này chưa
            // (Bạn check xem trong IMediaShareRepository nhóm có sẵn hàm check tương tự chưa, 
            // nếu chưa có thì có thể nhờ bạn viết Repo bổ sung một hàm dạng Bool giống dưới đây nhé)
            bool isSpam = await _mediaShareRepository.HasSharedInLast24HoursAsync(
                request.SenderId, 
                request.ReceiverId, 
                request.MediaItemId, 
                cancellationToken
            );

            // Nếu phát hiện spam, trả về Guid.Empty (hoặc throw lỗi tùy gu của nhóm) 
            // để Frontend biết và không ghi nhận lượt chia sẻ mới
            if (isSpam)
            {
                return Guid.Empty; 
            }

            // 2. Nếu không spam -> Tiếp tục luồng khởi tạo Request cũ của nhóm bạn
            var repoRequest = new CreateMediaShareRequest(
                request.SenderId,
                request.ReceiverId,
                request.MediaItemId,
                request.PlaylistId
            );

            // 3. Gọi Repository xử lý lưu DB + tạo Notification thông qua Transaction giống hệt cũ
            var shareId = await _mediaShareRepository.CreateMediaShareAsync(repoRequest, cancellationToken);

            // Trả về ID của lượt chia sẻ
            return shareId;
        }
    }
}