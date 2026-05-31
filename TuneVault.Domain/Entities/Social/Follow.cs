public class Follow
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required DateTime CreatedAt { get; set; }

    // Khóa ngoại (FK)
    public required string FollowerId { get; set; } // FK: Trỏ đến AppUser (Người đi theo dõi)

    // Chỉ 1 trong 2 trường dưới đây có giá trị
    public string? FolloweeId { get; set; } // Nullable FK: Trỏ đến AppUser (User được theo dõi)
    public Guid? ArtistId { get; set; } // Nullable FK: Trỏ đến Artist (Nghệ sĩ được theo dõi)
}