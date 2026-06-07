using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;

public class RemoveTrackFromPlaylistCommandHandler
    : IRequestHandler<RemoveTrackFromPlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;

    public RemoveTrackFromPlaylistCommandHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<bool> Handle(
        RemoveTrackFromPlaylistCommand request,
        CancellationToken cancellationToken)
    {
        await _playlistRepository.RemoveTrackAsync(
            request.PlaylistId,
            request.MediaItemId);

        return true;
    }
}