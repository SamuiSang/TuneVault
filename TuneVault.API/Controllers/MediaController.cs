using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Features.Media.Commands;
using TuneVault.Application.Features.Media.Queries;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.API.Controllers
{
    public class UploadMediaRequest
    {
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required int Duration { get; set; }
        public string? OwnerId { get; set; } 
        public Guid? AlbumId { get; set; }
        public required IFormFile File { get; set; }
    }

    public class ShareMediaApiRequest
    {
        public string? SenderId { get; set; } 
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

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia([FromForm] UploadMediaRequest request)
        {
            var ownerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst("id")?.Value
                        ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(ownerId))
            {
                return Unauthorized(new { success = false, message = "Không tìm thấy thông tin người dùng từ token." });
            }

            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn file để upload!" });
            }

            var allowedExtensions = new[] { ".mp3", ".wav", ".mp4" };
            var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { success = false, message = "Định dạng không hợp lệ! Chỉ hỗ trợ .mp3, .wav, .mp4" });
            }

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
                OwnerId = ownerId, 
                AlbumId = request.AlbumId,
                FileName = request.File.FileName,
                FileStream = fileStream
            };

            var resultId = await _mediator.Send(command);

            return Ok(new { success = true, data = resultId, message = "Upload file thành công!" });
        }

        [Authorize]
        [HttpPost("share")]
        public async Task<IActionResult> ShareMedia([FromBody] ShareMediaApiRequest request)
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("id")?.Value
                           ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized(new { success = false, message = "Không tìm thấy thông tin người gửi từ token." });
            }

            if (string.IsNullOrWhiteSpace(request.ReceiverId))
            {
                return BadRequest(new { success = false, message = "ReceiverId là bắt buộc." });
            }

            if (request.MediaItemId == null && request.PlaylistId == null)
            {
                return BadRequest(new { success = false, message = "Phải cung cấp MediaItemId hoặc PlaylistId để chia sẻ." });
            }

            var command = new ShareMediaCommand
            {
                SenderId = senderId,
                ReceiverId = request.ReceiverId,
                MediaItemId = request.MediaItemId,
                PlaylistId = request.PlaylistId
            };

            var resultId = await _mediator.Send(command);

            // Tinh chỉnh kết quả check spam từ handler trả về Guid.Empty
            if (resultId == Guid.Empty)
            {
                return BadRequest(new { success = false, message = "Bạn đã chia sẻ bài hát này gần đây rồi. Vui lòng không spam!" });
            }

            return Ok(new { success = true, data = resultId, message = "Chia sẻ thành công, đã lưu vào hộp thư!" });
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromServices] TuneVault.Application.Common.Interfaces.ICloudStorageService cloudStorageService)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { success = false, message = "Vui lòng chọn ảnh!" });
            }

            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { success = false, message = "Chỉ hỗ trợ tệp .png, .jpg, .jpeg, .webp" });
            }

            try
            {
                using var fileStream = file.OpenReadStream();
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

       [HttpGet("{id}/stream")]
        public async Task<IActionResult> StreamMedia(Guid id, [FromServices] IMediaRepository mediaRepository, CancellationToken cancellationToken)
        {
            // 1. Gọi Repo lấy trực tiếp chuỗi link (FilePath) lưu trong DB ra
            var filePath = await mediaRepository.GetMediaFilePathAsync(id, cancellationToken);
            
            if (string.IsNullOrEmpty(filePath))
            {
                return NotFound(new { success = false, message = "Không tìm thấy file media yêu cầu." });
            }
            // 2. Lược bỏ/Đơn giản hóa phần stream file vật lý.
            // Vì media lưu trên Cloudinary, API chỉ cần Query DB và trả thẳng FilePath (URL Cloudinary) về cho Frontend dưới dạng JSON.
            // Trình duyệt của user sẽ tự tải/stream trực tiếp từ server của Cloudinary, giúp Backend của bạn cực kỳ nhẹ.
            return Ok(new 
            { 
                success = true, 
                streamUrl = filePath // Đổi key thành 'streamUrl' để khớp hoàn toàn với interface frontend
            });
        }
    }
}