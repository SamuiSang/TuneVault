using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.DeletePlaylist;

public class DeletePlaylistCommand : IRequest<bool>
{
    public DeletePlaylistCommand(Guid playlistId)
    {
        PlaylistId = playlistId;
    }

    public Guid PlaylistId { get; set; }
}