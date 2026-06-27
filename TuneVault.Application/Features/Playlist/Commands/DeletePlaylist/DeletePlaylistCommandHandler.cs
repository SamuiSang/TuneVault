using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Playlist.Commands.DeletePlaylist;

public class DeletePlaylistCommandHandler
    : IRequestHandler<DeletePlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeletePlaylistCommandHandler(
        IPlaylistRepository playlistRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _playlistRepository = playlistRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(
        DeletePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        var existingPlaylist = await _playlistRepository.GetByIdAsync(request.PlaylistId, cancellationToken);
        if (existingPlaylist == null)
        {
            throw new KeyNotFoundException("Không tìm thấy Playlist cần xóa.");
        }

        var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (existingPlaylist.OwnerId != currentUserId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền xóa Playlist này.");
        }

        await _playlistRepository.DeleteAsync(
            request.PlaylistId);

        return true;
    }
}