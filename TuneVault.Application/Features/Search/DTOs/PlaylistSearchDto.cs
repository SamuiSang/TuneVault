namespace TuneVault.Application.Features.Search.DTOs;

public class PlaylistSearchDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsPublic { get; set; }

    public string OwnerId { get; set; } = string.Empty;

    public int TotalTracks { get; set; }
}