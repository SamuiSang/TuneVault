using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;

public class RemoveTrackFromPlaylistCommand : IRequest<bool>
{
    private Guid mediaId;

    public RemoveTrackFromPlaylistCommand(Guid playlistId, Guid mediaId)
    {
        PlaylistId = playlistId;
        this.mediaId = mediaId;
    }

    public Guid PlaylistId { get; set; }

    
    public Guid MediaItemId { get; set; }
}