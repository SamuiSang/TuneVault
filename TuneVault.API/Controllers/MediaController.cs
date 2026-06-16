using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TuneVault.Application.Features.Media.Commands;
using TuneVault.Application.Features.Media.Queries;

namespace TuneVault.API.Controllers
{
    public class UploadMediaRequest
    {
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required int Duration { get; set; }
        public required string OwnerId { get; set; }
        public Guid? AlbumId { get; set; }
        public required IFormFile File { get; set; }
    }

    // Class hứng dữ liệu từ Frontend gửi lên cho API Share
    public class ShareMediaApiRequest
    {
        public required string SenderId { get; set; }
        public required string ReceiverId { get; set; }
        public Guid? MediaItemId { get; set; }
        public Guid? PlaylistId { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MediaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia([FromForm] UploadMediaRequest request)
        {
            // Đã sửa lại logic check File bị null
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn file để upload!" });
            }

            // 1. Kiểm tra định dạng (Chỉ cho phép mp3, wav, mp4)
            var allowedExtensions = new[] { ".mp3", ".wav", ".mp4" };
            var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { success = false, message = "Định dạng không hợp lệ! Chỉ hỗ trợ .mp3, .wav, .mp4" });
            }

            // 2. Kiểm tra dung lượng (Giới hạn 50MB)
            var maxFileSize = 50 * 1024 * 1024; // 50MB
            if (request.File.Length > maxFileSize)
            {
                return BadRequest(new { success = false, message = "Kích thước file quá lớn! Vui lòng upload file dưới 50MB." });
            }

            using var fileStream = request.File.OpenReadStream();

            var command = new UploadMediaCommand
            {
                Title = request.Title,
                Type = request.Type,
                Duration = request.Duration,
                OwnerId = request.OwnerId,
                AlbumId = request.AlbumId,
                FileName = request.File.FileName,
                FileStream = fileStream
            };

            var resultId = await _mediator.Send(command);

            return Ok(new { success = true, data = resultId, message = "Upload file thành công!" });
        }

        // ---> ĐÂY LÀ ENDPOINT SHARE MEDIA VỪA LÀM <---
        [HttpPost("share")]
        public async Task<IActionResult> ShareMedia([FromBody] ShareMediaApiRequest request)
        {
            var command = new ShareMediaCommand
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                MediaItemId = request.MediaItemId,
                PlaylistId = request.PlaylistId
            };

            var resultId = await _mediator.Send(command);

            return Ok(new { success = true, data = resultId, message = "Chia sẻ thành công, đã lưu vào hộp thư!" });
        }

        // ---> ENDPOINT UPLOAD HÌNH ẢNH (Avatar, Ảnh Bìa...) MỚI THÊM <---
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromServices] TuneVault.Application.Common.Interfaces.ICloudStorageService cloudStorageService)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn ảnh!" });
            }

            // Kiểm tra định dạng
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { success = false, message = "Chỉ hỗ trợ tệp .png, .jpg, .jpeg, .webp" });
            }

            try
            {
                using var fileStream = file.OpenReadStream();
                // Gọi thẳng vào hàm xử lý Image, nó sẽ tự động đưa vào thư mục 'tunevault/images'
                var imageUrl = await cloudStorageService.UploadImageAsync(fileStream, file.FileName);
                
                return Ok(new { success = true, data = imageUrl, message = "Upload ảnh thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Lỗi upload: {ex.Message}" });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllMedia()
        {
            var query = new GetMediaListQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Hỗ trợ Streaming và Range Header của Hiếu
        [HttpGet("{id}/stream")]
        public async Task<IActionResult> StreamMedia(Guid id, [FromServices] TuneVault.Application.Common.Interfaces.Repositories.IMediaRepository mediaRepository)
        {
            var filePath = await mediaRepository.GetMediaFilePathAsync(id);
            if (string.IsNullOrEmpty(filePath))
                return NotFound(new { success = false, message = "Không tìm thấy file media." });

            // Nếu filePath là URL từ Cloudinary (bắt đầu bằng http hoặc https) thì Redirect thẳng đến URL đó
            if (filePath.StartsWith("http://") || filePath.StartsWith("https://"))
            {
                return Redirect(filePath);
            }

            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));

            if (!System.IO.File.Exists(physicalPath))
                return NotFound(new { success = false, message = "File vật lý không tồn tại trên server." });

            var contentType = filePath.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase) ? "video/mp4" : "audio/mpeg";

            return PhysicalFile(physicalPath, contentType, enableRangeProcessing: true);
        }
    }
}