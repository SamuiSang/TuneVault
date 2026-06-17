using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Media.Commands;

namespace TuneVault.Application.Features.Media.Commands.DeleteMedia
{
    public class DeleteMediaCommandHandler : IRequestHandler<DeleteMediaCommand, bool>
    {
        private readonly IMediaRepository _mediaRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteMediaCommandHandler(
            IMediaRepository mediaRepository, 
            IHttpContextAccessor httpContextAccessor)
        {
            _mediaRepository = mediaRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Handle(DeleteMediaCommand request, CancellationToken cancellationToken)
        {
            // 1. Gọi xuống Repository lấy bài hát lên để kiểm tra OwnerId
            var mediaItem = await _mediaRepository.GetMediaByIdAsync(request.Id, cancellationToken);
            if (mediaItem == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài hát cần xóa.");
            }

            // 2. Lấy UserId từ Token của người gửi Request
            var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            // 🌟 BẢO MẬT: Kiểm tra nếu người dùng hiện tại không phải chủ sở hữu bài hát
            if (mediaItem.OwnerId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài hát này.");
            }

            // 3. Đúng chính chủ -> Ra lệnh cho Repo thực hiện xóa
            await _mediaRepository.DeleteAsync(request.Id, cancellationToken);
            return true;
        }
    }
}