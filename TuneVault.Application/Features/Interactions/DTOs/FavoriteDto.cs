namespace TuneVault.Application.Features.Interactions.DTOs;

public record FavoriteDto
{
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
    public required DateTime CreatedAt { get; set; }
}

public record FavoriteMediaDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required int Duration { get; set; }
    public required string Type { get; set; }
    public required string FilePath { get; set; }
    public required DateTime FavoritedAt { get; set; }
    public string? ArtistName { get; set; }
    public string? ThumbnailUrl { get; set; }
}
