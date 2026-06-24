using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Media.Commands
{
    public class ShareMediaCommandHandler : IRequestHandler<ShareMediaCommand, Guid>
    {
        private readonly IMediaShareRepository _mediaShareRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotificationService _notificationService;

        public ShareMediaCommandHandler(IMediaShareRepository mediaShareRepository, IUserRepository userRepository, INotificationService notificationService)
        {
            _mediaShareRepository = mediaShareRepository;
            _userRepository = userRepository;
            _notificationService = notificationService;
        }

        public async Task<Guid> Handle(ShareMediaCommand request, CancellationToken cancellationToken)
        {
            // 🌟 1. TÌM ID TỪ USERNAME (Lưu vào biến receiverId)
            var receiverId = await _userRepository.GetIdByUsernameAsync(request.ReceiverUsername, cancellationToken);
            
            // Nếu không tìm thấy (chuỗi rỗng), báo lỗi
            if (string.IsNullOrEmpty(receiverId))
            {
                throw new ArgumentException($"Người nhận '{request.ReceiverUsername}' không tồn tại trong hệ thống.");
            }

            // Chặn chia sẻ cho chính bản thân
            if (request.SenderId == receiverId)
            {
                throw new ArgumentException("Bạn không thể tự chia sẻ cho chính mình.");
            }

            // 🌟 2. CHỐNG SPAM: Truyền biến receiverId vừa tìm được vào đây
            bool isSpam = await _mediaShareRepository.HasSharedInLast24HoursAsync(
                request.SenderId, 
                receiverId, // Dùng biến cục bộ, KHÔNG có chữ "request." ở trước
                request.MediaItemId, 
                request.PlaylistId, // Thêm PlaylistId
                cancellationToken
            );

            if (isSpam)
            {
                return Guid.Empty; 
            }

            // 🌟 3. LƯU VÀO DATABASE
            var repoRequest = new CreateMediaShareRequest(
                request.SenderId,
                receiverId, // Dùng biến cục bộ, KHÔNG có chữ "request." ở trước
                request.MediaItemId,
                request.PlaylistId
            );

            // Gọi Repository xử lý lưu DB + tạo Notification
            var shareId = await _mediaShareRepository.CreateMediaShareAsync(repoRequest, cancellationToken);

            // 🌟 4. GỬI NOTIFICATION QUA SIGNALR
            await _notificationService.SendNotificationToUserAsync(
                receiverId,
                "MediaShare",
                new
                {
                    ShareId = shareId,
                    SenderId = request.SenderId,
                    MediaItemId = request.MediaItemId,
                    PlaylistId = request.PlaylistId,
                    Message = request.PlaylistId.HasValue ? "Bạn có một Playlist mới được chia sẻ!" : "Bạn có một bài hát mới được chia sẻ!"
                },
                cancellationToken
            );

            return shareId;
        }
    }
}