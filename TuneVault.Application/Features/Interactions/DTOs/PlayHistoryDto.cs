namespace TuneVault.Application.Features.Interactions.DTOs;

public record PlayHistoryDto
{
    public required Guid Id { get; set; }
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
    public required DateTime PlayedAt { get; set; }
}

public record PlayHistoryDetailDto
{
    public required Guid Id { get; set; }
    public required Guid MediaId { get; set; }
    public required string Title { get; set; }
    public required int Duration { get; set; }
    public required string Type { get; set; }
    public required DateTime PlayedAt { get; set; }
}

public record TopPlayedMediaDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required int Duration { get; set; }
    public required string Type { get; set; }
    public required int PlayCount { get; set; }
}
