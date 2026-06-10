using MediatR;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetPlaylistDetail;

public class GetPlaylistDetailQuery : IRequest<PlaylistDetailDto?>
{
    public GetPlaylistDetailQuery(Guid playlistId)
    {
        PlaylistId = playlistId;
    }

    public Guid PlaylistId { get; set; }
}