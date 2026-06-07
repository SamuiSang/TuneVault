using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;

public class AddTrackToPlaylistCommandHandler
    : IRequestHandler<AddTrackToPlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;

    public AddTrackToPlaylistCommandHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<bool> Handle(
        AddTrackToPlaylistCommand request,
        CancellationToken cancellationToken)
    {
        await _playlistRepository.AddTrackAsync(
            request.PlaylistId,
            request.MediaItemId);

        return true;
    }
}