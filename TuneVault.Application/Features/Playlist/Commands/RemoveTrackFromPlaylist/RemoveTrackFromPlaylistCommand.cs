using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;

public class RemoveTrackFromPlaylistCommand : IRequest<bool>
{
    public RemoveTrackFromPlaylistCommand(Guid playlistId, Guid mediaId)
    {
        PlaylistId = playlistId;
        MediaItemId = mediaId;
    }

    public Guid PlaylistId { get; set; }
    public Guid MediaItemId { get; set; }
}