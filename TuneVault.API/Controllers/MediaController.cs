using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
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
            if (request.File == null || request.File.Length == 0)
            {
                // 1. Kiểm tra định dạng (Chỉ cho phép mp3, wav, mp4)
                var allowedExtensions = new[] { ".mp3", ".wav", ".mp4" };
                var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { success = false, message = "Định dạng không hợp lệ! Chỉ hỗ trợ .mp3, .wav, .mp4" });
                }

                // 2. Kiểm tra dung lượng (Giới hạn 50MB)
                var maxFileSize = 50 * 1024 * 1024; // 50MB tính bằng byte
                if (request.File.Length > maxFileSize)
                {
                    return BadRequest(new { success = false, message = "Kích thước file quá lớn! Vui lòng upload file dưới 50MB." });
                }
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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllMedia()
        {
            var query = new GetMediaListQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}