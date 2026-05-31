public class MediaItem
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required string Title { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Description { get; set; } // Phục vụ chức năng AI tóm tắt
    public required string Type { get; set; } // Audio hoặc Video
    public required int Duration { get; set; }
    public required string FilePath { get; set; }

    // Khóa ngoại (FK)
    public Guid? AlbumId { get; set; } // Nullable FK: Trỏ đến Album (Có thể null nếu là đĩa đơn - Single)
    public required string OwnerId { get; set; } // FK: Trỏ đến bảng AppUser (AspNetUsers)
}