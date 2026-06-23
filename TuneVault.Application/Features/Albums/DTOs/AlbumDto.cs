namespace TuneVault.Application.Features.Albums.DTOs;

public class AlbumDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string ArtistId { get; set; } = string.Empty;
    public string? ArtistName { get; set; }
}

public class AlbumDetailDto : AlbumDto
{
    public IEnumerable<AlbumTrackDto> Tracks { get; set; } = new List<AlbumTrackDto>();
}

public class AlbumTrackDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public string? OwnerName { get; set; }
}
