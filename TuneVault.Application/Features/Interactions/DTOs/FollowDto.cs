namespace TuneVault.Application.Features.Interactions.DTOs;

public record FollowDto
{
    public required Guid Id { get; set; }
    public required string FollowerId { get; set; }
    public string? FolloweeId { get; set; }
    public required DateTime CreatedAt { get; set; }
}

public record FollowingUserDto
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public required DateTime FollowedAt { get; set; }
}

public record FollowingArtistDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public required DateTime FollowedAt { get; set; }
}

public record FollowerUserDto
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public required DateTime FollowedAt { get; set; }
}

public record FollowStatsDto
{
    public int FollowerCount { get; set; }
    public int FollowingUserCount { get; set; }
    public int FollowingArtistCount { get; set; }
}
