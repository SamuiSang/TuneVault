namespace TuneVault.Application.Features.Search.DTOs;

public class ArtistDto
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Biography { get; set; }

    public string? ImageUrl { get; set; }

    public int TotalTracks { get; set; }
}