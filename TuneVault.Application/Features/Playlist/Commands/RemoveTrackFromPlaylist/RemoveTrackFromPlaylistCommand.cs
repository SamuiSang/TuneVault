using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;

public class RemoveTrackFromPlaylistCommand : IRequest<bool>
{
    
    public Guid PlaylistId { get; set; }

    
    public Guid MediaItemId { get; set; }
}