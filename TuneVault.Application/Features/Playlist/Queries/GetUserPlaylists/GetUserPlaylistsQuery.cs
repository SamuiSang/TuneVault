using MediatR;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetUserPlaylists;

public class GetUserPlaylistsQuery : IRequest<IEnumerable<PlaylistDto>>
{
    private Guid guid;

    public GetUserPlaylistsQuery(string userId)
    {
        UserId = userId;
    }

    public GetUserPlaylistsQuery(Guid guid)
    {
        this.guid = guid;
    }

    public string UserId { get; set; } = string.Empty;
}