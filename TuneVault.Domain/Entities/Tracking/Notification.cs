public class Notification
{
    // Khóa chính (PK)
    public required Guid Id { get; set; }

    // Thuộc tính
    public required string Type { get; set; }
    public required string PayloadJson { get; set; }
    public required bool IsRead { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Khóa ngoại (FK)
    public required string UserId { get; set; } // FK: Trỏ đến AppUser (Người nhận thông báo)
}