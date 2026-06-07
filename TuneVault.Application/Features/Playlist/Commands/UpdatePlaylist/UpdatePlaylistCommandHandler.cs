using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Playlist.Commands.UpdatePlaylist;

public class UpdatePlaylistCommandHandler
    : IRequestHandler<UpdatePlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;

    public UpdatePlaylistCommandHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<bool> Handle(
        UpdatePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        var playlist = new Playlists
        {
            Id = request.PlaylistId,
            Name = request.Name,
            IsPublic = request.IsPublic,
            OwnerId = request.OwnerId
        };

        await _playlistRepository.UpdateAsync(playlist);

        return true;
    }
}