using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;

public class AddTrackToPlaylistCommand : IRequest<bool>
{
    
    public Guid PlaylistId { get; set; }

    
    public Guid MediaItemId { get; set; }
}