using MediatR;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetUserPlaylists;

public class GetUserPlaylistsQuery : IRequest<IEnumerable<PlaylistDto>>
{
    
    public string UserId { get; set; } = string.Empty;
}