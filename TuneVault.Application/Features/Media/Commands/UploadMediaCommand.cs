using MediatR;
using System.IO; // Thư viện này để dùng Stream

namespace TuneVault.Application.Features.Media.Commands
{
    // IRequest<string> nghĩa là sau khi thực hiện xong, lệnh này sẽ trả về 1 chuỗi (là ID của bài hát)
    public class UploadMediaCommand : IRequest<string>
    {
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required int Duration { get; set; }

        // Tuyệt đối không dùng IFormFile ở đây để giữ code "sạch". Ta dùng FileName và FileStream.
        public required string FileName { get; set; }
        public required Stream FileStream { get; set; }

        public required string OwnerId { get; set; }
        public Guid? AlbumId { get; set; }
    }
}
