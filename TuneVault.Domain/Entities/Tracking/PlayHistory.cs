public class PlayHistory
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required DateTime PlayedAt { get; set; }

    // Khóa ngoại (FK)
    public required string UserId { get; set; } // FK: Trỏ đến AppUser
    public required Guid MediaItemId { get; set; } // FK: Trỏ đến MediaItem
}