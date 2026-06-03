public class Artist
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required string Name { get; set; }

    // Thuộc tính Nullable
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}   