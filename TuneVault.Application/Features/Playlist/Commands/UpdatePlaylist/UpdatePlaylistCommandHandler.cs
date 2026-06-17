using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Playlist.Commands.UpdatePlaylist
{
    public class UpdatePlaylistCommandHandler : IRequestHandler<UpdatePlaylistCommand, bool>
    {
        private readonly IPlaylistRepository _playlistRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UpdatePlaylistCommandHandler(
            IPlaylistRepository playlistRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _playlistRepository = playlistRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Handle(UpdatePlaylistCommand request, CancellationToken cancellationToken)
        {
            // 1. Gọi xuống Repository lấy thông tin Playlist đang có trong DB lên để check
            var existingPlaylist = await _playlistRepository.GetByIdAsync(request.PlaylistId, cancellationToken);
            if (existingPlaylist == null)
            {
                throw new KeyNotFoundException("Không tìm thấy Playlist cần cập nhật.");
            }

            // 2. Lấy UserId của người đang gửi request sửa từ Token
            var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            // 🌟 BẢO MẬT: Nếu không phải chính chủ -> Chặn cửa ngay tại Handler
            if (existingPlaylist.OwnerId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa Playlist này.");
            }

            // 3. Chuẩn hóa theo gu của nhóm: Tạo object Entity/Request rồi đẩy xuống Repo cập nhật
            var playlist = new TuneVault.Domain.Entities.Playlist
            {
                Id = request.PlaylistId,
                Name = request.Name,
                IsPublic = request.IsPublic,
                OwnerId = existingPlaylist.OwnerId // Giữ nguyên Owner cũ dưới DB cho an toàn
            };

            await _playlistRepository.UpdateAsync(playlist);
            return true;
        }
    }
}