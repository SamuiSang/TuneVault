using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Entities
{
    // Kế thừa IdentityUser để có sẵn Id (string), UserName, Email, PasswordHash...
    public class AppUser : IdentityUser
    {
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }

        // ==========================================================
        // NAVIGATION PROPERTIES (Giải quyết các mối quan hệ 1-N)
        // Khởi tạo list trực tiếp để tránh lỗi NullReferenceException
        // ==========================================================

        // Người dùng tải lên các MediaItem (Audio/Video)
        public ICollection<MediaItem> UploadedMediaItem { get; set; } = new List<MediaItem>();
        // Người dùng tạo ra các Playlist
        public ICollection<Playlist> Playlists { get; set; } = new List<PlayList>();
        // Lịch sử chia sẻ Media (Đóng vai trò là người gửi hoặc người nhận)
        public ICollection<MediaShare> SentShares { get; set; } = new List<MediaShare>();
        public ICollection<MediaShare> ReceivedShares { get; set; } = new List<MediaShare>();
        // Lịch sử người dùng nhận thông báo
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        // Danh sách các bài hát/video yêu thích của người dùng
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorites>();
        // Lịch sử nghe nhạc/xem video
        public ICollection<PlayHistory> PlayHistories { get; set; } = new List<PlayHistory>();
        // Quan hệ Follow: Người mà User này đang theo dõi & Những người theo dõi User này
        public ICollection<Follow> Following { get; set; } = new List<Follow>();
        public ICollection<Follow> Followers { get; set; } = new List<Follow>();
    }
}

