namespace TuneVault.Domain.Entities.Users;

using Microsoft.AspNetCore.Identity;

public class AppUser : IdentityUser
{
    // Thuộc tính mới thêm
    public string? DisplayName { get; set; }
    public bool IsArtist { get; set; } = false; // Cờ phân biệt nghệ sĩ

    // Thuộc tính Nullable
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}