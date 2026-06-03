public class Favorite
{
    // Khóa ngoại (FK) đồng thời là Composite Key
    public required string UserId { get; set; } // FK: Trỏ đến AppUser
    public required Guid MediaItemId { get; set; } // FK: Trỏ đến MediaItem

    // Thuộc tính
    public required DateTime CreatedAt { get; set; }
}