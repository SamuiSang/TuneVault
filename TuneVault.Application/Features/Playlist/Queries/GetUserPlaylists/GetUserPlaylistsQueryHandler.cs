using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetUserPlaylists;

public class GetUserPlaylistsQueryHandler
    : IRequestHandler<GetUserPlaylistsQuery, IEnumerable<PlaylistDto>>
{
    private readonly IPlaylistRepository _playlistRepository;

    public GetUserPlaylistsQueryHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<IEnumerable<PlaylistDto>> Handle(
        GetUserPlaylistsQuery request,
        CancellationToken cancellationToken)
    {
        return await _playlistRepository
            .GetUserPlaylistAsync(request.UserId);
    }
}