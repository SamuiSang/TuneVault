namespace TuneVault.Domain.Entities;

public class Album
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required string Title { get; set; }
    public required DateTime ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }

    // Khóa ngoại (FK)
    public required string ArtistId { get; set; } // Đổi sang string: Trỏ đến AppUser (có IsArtist = true)
}