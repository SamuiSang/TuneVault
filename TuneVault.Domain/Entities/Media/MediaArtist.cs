public class MediaArtist
{
    // Khóa ngoại (FK) đồng thời là Composite Key
    public required Guid MediaItemId { get; set; } // FK: Trỏ đến MediaItem
    public required Guid ArtistId { get; set; } // FK: Trỏ đến Artist
}