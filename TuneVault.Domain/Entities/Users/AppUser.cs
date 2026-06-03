using Microsoft.AspNetCore.Identity;

public class AppUser : IdentityUser
{

    // Thuộc tính Nullable
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}