using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Playlist.Commands.DeletePlaylist;

public class DeletePlaylistCommandHandler
    : IRequestHandler<DeletePlaylistCommand, bool>
{
    private readonly IPlaylistRepository _playlistRepository;

    public DeletePlaylistCommandHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<bool> Handle(
        DeletePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        await _playlistRepository.DeleteAsync(
            request.PlaylistId);

        return true;
    }
}