using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;

public class AddTrackToPlaylistCommand : IRequest<bool>
{
    private Guid mediaId;

    public AddTrackToPlaylistCommand(Guid playlistId, Guid mediaId)
    {
        PlaylistId = playlistId;
        this.mediaId = mediaId;
    }

    public Guid PlaylistId { get; set; }

    
    public Guid MediaItemId { get; set; }
}