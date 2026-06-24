using MediatR;

namespace TuneVault.Application.Features.Playlist.Commands.UpdatePlaylist;

public class UpdatePlaylistCommand : IRequest<bool>
{
    
    public Guid PlaylistId { get; set; }

    
    public string Name { get; set; } = string.Empty;

    
    public bool IsPublic { get; set; }

    
    public string OwnerId { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
}