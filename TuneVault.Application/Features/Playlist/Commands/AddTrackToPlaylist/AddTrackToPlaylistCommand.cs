using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;

public class AddTrackToPlaylistCommand : IRequest<bool>
{
    public AddTrackToPlaylistCommand(Guid playlistId, Guid mediaId)
    {
        PlaylistId = playlistId;
        MediaItemId = mediaId;
    }

    public Guid PlaylistId { get; set; }

    
    public Guid MediaItemId { get; set; }
}