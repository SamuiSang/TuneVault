namespace TuneVault.Domain.Entities;

public class Follow
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required DateTime CreatedAt { get; set; }

    // Khóa ngoại (FK)
    public required string FollowerId { get; set; } // FK: Trỏ đến AppUser (Người đi theo dõi)
    public required string FolloweeId { get; set; } // FK: Trỏ đến AppUser (Người/Nghệ sĩ được theo dõi)
}