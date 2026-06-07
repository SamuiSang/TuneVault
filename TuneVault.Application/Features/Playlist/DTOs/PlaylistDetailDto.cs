using System;
using System.Collections.Generic;

namespace TuneVault.Application.Features.Playlist.DTOs;

public class PlaylistDetailDto
{
    
    public Guid Id { get; set; }

    
    public string Name { get; set; } = string.Empty;

    
    public bool IsPublic { get; set; }

    
    public string OwnerId { get; set; } = string.Empty;

    
    public int TotalTracks { get; set; }

    
    public List<TrackDto> Tracks { get; set; } = new();
}