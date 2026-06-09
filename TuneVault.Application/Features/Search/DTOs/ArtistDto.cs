namespace TuneVault.Application.Features.Search.DTOs;

public class ArtistDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Biography { get; set; }

    public string? ImageUrl { get; set; }

    public int TotalTracks { get; set; }
}