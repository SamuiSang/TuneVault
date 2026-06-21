namespace TuneVault.Domain.Entities;

public class MediaArtist
{
    // Khóa ngoại (FK) đồng thời là Composite Key
    public required Guid MediaItemId { get; set; } // FK: Trỏ đến MediaItem
    public required string ArtistId { get; set; } // Đổi sang string: Trỏ đến AppUser (có IsArtist = true)
}