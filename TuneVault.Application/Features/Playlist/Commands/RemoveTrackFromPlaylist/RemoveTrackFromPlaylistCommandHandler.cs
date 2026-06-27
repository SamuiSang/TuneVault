using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;

public class RemoveTrackFromPlaylistCommandHandler
    : IRequestHandler<RemoveTrackFromPlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RemoveTrackFromPlaylistCommandHandler(
        IPlaylistRepository playlistRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _playlistRepository = playlistRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(
        RemoveTrackFromPlaylistCommand request,
        CancellationToken cancellationToken)
    {
        var existingPlaylist = await _playlistRepository.GetByIdAsync(request.PlaylistId, cancellationToken);
        if (existingPlaylist == null)
        {
            throw new KeyNotFoundException("Không tìm thấy Playlist.");
        }

        var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (existingPlaylist.OwnerId != currentUserId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền sửa Playlist này.");
        }

        await _playlistRepository.RemoveTrackAsync(
            request.PlaylistId,
            request.MediaItemId);

        return true;
    }
}