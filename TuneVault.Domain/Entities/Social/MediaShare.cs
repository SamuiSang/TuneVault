public class MediaShare
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required DateTime SharedAt { get; set; }

    // Khóa ngoại (FK)
    public required string SenderId { get; set; } // FK: Trỏ đến AppUser (Người gửi)
    public required string ReceiverId { get; set; } // FK: Trỏ đến AppUser (Người nhận)
    public Guid? MediaItemId { get; set; } // Nullable FK: Trỏ đến MediaItem
    public Guid? PlaylistId { get; set; } // Nullable FK: Trỏ đến Playlist
}