using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace TuneVault.Application.Features.Media.Commands
{
    // IRequestHandler nhận vào UploadMediaCommand và trả về string (ID bài hát)
    public class UploadMediaCommandHandler : IRequestHandler<UploadMediaCommand, string>
    {
        public async Task<string> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
        {
            // --- PHẦN 1: TÌM VỊ TRÍ CẤT FILE ---
            // Tự động tạo tên thư mục (ví dụ: "audios" hoặc "videos")
            var folderName = request.Type.ToLower() + "s";

            // Đường dẫn tới thư mục wwwroot/uploads/...
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);

            // Nếu thư mục chưa tồn tại thì hệ thống tự tạo
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // --- PHẦN 2: LƯU FILE VẬT LÝ ---
            // Thêm Guid vào trước tên file để lỡ 2 người up cùng tên cũng không bị ghi đè
            var fileName = $"{Guid.NewGuid()}_{request.FileName}";
            var filePath = Path.Combine(uploadFolder, fileName);

            // Mở luồng ghi và chép dữ liệu từ Command ra file thực tế
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await request.FileStream.CopyToAsync(fileStream, cancellationToken);
            }

            // --- PHẦN 3: LƯU DATABASE (TẠM TẮT ĐỂ TEST FILE) ---
            // Lưu ý: Đáng lẽ ở đây mình sẽ gọi Dapper để lưu thông tin vào SQL Server.
            // Nhưng vì bạn Sang (thành viên 1) chưa đưa script tạo Database cho bạn,
            // nên mình tạm thời BỎ QUA bước này để lúc test không bị báo lỗi đỏ (Lỗi 500).

            // Tạm thời trả về một ID ảo báo hiệu lưu file thành công
            var fakeId = Guid.NewGuid().ToString();
            return fakeId;
        }
    }
}