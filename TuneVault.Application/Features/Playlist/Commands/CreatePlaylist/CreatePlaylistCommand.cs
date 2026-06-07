using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.CreatePlaylist;

public class CreatePlaylistCommand : IRequest<Guid>
{
    
    public string Name { get; set; } = string.Empty;

    
    public bool IsPublic { get; set; }

    
    public string OwnerId { get; set; } = string.Empty;
}