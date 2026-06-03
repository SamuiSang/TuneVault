public class Playlist
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required string Name { get; set; }
    public required bool IsPublic { get; set; }
    public string? CoverImageUrl { get; set; }

    // Khóa ngoại (FK)
    public required string OwnerId { get; set; } // FK: Trỏ đến AppUser
}