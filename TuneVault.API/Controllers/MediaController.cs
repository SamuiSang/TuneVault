using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TuneVault.Application.Features.Media.Commands;
// Bổ sung thêm dòng using này để Quầy lễ tân biết chỗ tìm file Query lấy danh sách
using TuneVault.Application.Features.Media.Queries;

namespace TuneVault.API.Controllers
{
    // Class này dùng để hứng dữ liệu từ Form của người dùng gửi lên
    public class UploadMediaRequest
    {
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required int Duration { get; set; }
        public required string OwnerId { get; set; }
        public Guid? AlbumId { get; set; }

        // Đây là nơi duy nhất chúng ta được dùng IFormFile
        public required IFormFile File { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly IMediator _mediator;

        // Gọi "băng chuyền" MediatR ra để chuẩn bị chuyển phát
        public MediaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia([FromForm] UploadMediaRequest request)
        {
            // 1. Kiểm tra xem người dùng có chọn file chưa
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest(new { success = false, message = "Bạn chưa chọn file nhạc/video!" });
            }

            // 2. Mở hộp file ra lấy luồng dữ liệu (Stream)
            using var fileStream = request.File.OpenReadStream();

            // 3. Ghi thông tin vào "Phiếu luân chuyển" (Command)
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

            // 4. Đặt phiếu lên băng chuyền gửi vào kho (tầng Application)
            var resultId = await _mediator.Send(command);

            // 5. Trả kết quả báo thành công
            return Ok(new { success = true, data = resultId, message = "Upload file vào wwwroot thành công mĩ mãn!" });
        }

        // ========================================================
        // TÍNH NĂNG MỚI: LẤY DANH SÁCH BÀI NHẠC (GET)
        // ========================================================
        [HttpGet("all")]
        public async Task<IActionResult> GetAllMedia()
        {
            // 1. Tạo một đơn yêu cầu trống để lấy toàn bộ dữ liệu
            var query = new GetMediaListQuery();

            // 2. Bắn qua MediatR để xử lý quét SQL Server
            var result = await _mediator.Send(query);

            // 3. Trả về danh sách xịn sò cho Postman
            return Ok(result);
        }
    }
}