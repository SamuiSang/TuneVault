namespace TuneVault.Application.Features.Search.DTOs;

public class UserSearchDto
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsArtist { get; set; }
}
