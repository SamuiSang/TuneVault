using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.DeletePlaylist;

public class DeletePlaylistCommand : IRequest<bool>
{
    
    public Guid PlaylistId { get; set; }
}