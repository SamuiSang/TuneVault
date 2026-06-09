public class PlaylistTrack
{
    // Khóa ngoại (FK) đồng thời là Composite Key
    public required Guid PlaylistId { get; set; } // FK: Trỏ đến Playlist
    public required Guid MediaItemId { get; set; } // FK: Trỏ đến MediaItem

    // Thuộc tính
    public required DateTime AddedAt { get; set; }
}