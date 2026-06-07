using MediatR;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetPlaylistDetail;

public class GetPlaylistDetailQuery : IRequest<PlaylistDetailDto?>
{
    
    public Guid PlaylistId { get; set; }
}