using System;

namespace TuneVault.Application.Features.Playlist.DTOs;

public class TrackDto
{
    
    public Guid Id { get; set; }

    
    public string Title { get; set; } = string.Empty;

    
    public string ArtistName { get; set; } = string.Empty;
    public string Type { get; set; } = "Audio";
    
    public int Duration { get; set; }

    
    public string? AlbumTitle { get; set; }

    
    public string? ThumbnailUrl { get; set; }
}