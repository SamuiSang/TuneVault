namespace TuneVault.Application.Features.Playlist.DTOs;

public class PlaylistDto
{
    
    public Guid Id { get; set; }

    
    public string Name { get; set; } = string.Empty;

    
    public bool IsPublic { get; set; }

    public string OwnerId { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
    
    public int TotalTracks { get; set; }
}