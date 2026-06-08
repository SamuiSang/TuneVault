using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Media.DTOs;
using TuneVault.Application.Features.Media.Queries.GetMediaInfo;
using TuneVault.Application.Features.Media.Queries.GetMediaMetadata;
using TuneVault.Application.Features.Media.Queries.GetMediaStream;

namespace TuneVault.API.Controllers;

/// <summary>
/// Controller để xử lý media streaming và metadata
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<MediaController> _logger;

    public MediaController(IMediator mediator, ILogger<MediaController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Stream media file (audio/video) với hỗ trợ Range header
    /// </summary>
    /// <param name="id">ID của media</param>
    /// <returns>File stream (206 Partial Content hoặc 200 OK)</returns>
    /// <remarks>
    /// Ví dụ request:
    /// GET /api/media/123/stream
    /// Range: bytes=0-1023
    /// 
    /// Response:
    /// HTTP/1.1 206 Partial Content
    /// Content-Range: bytes 0-1023/10000
    /// Content-Length: 1024
    /// Content-Type: video/mp4
    /// </remarks>
    [HttpGet("{id}/stream")]
    public async Task<IActionResult> StreamMedia(Guid id)
    {
        try
        {
            _logger.LogInformation($"Stream request for media: {id}");

            // 1. Parse Range header (nếu có)
            var rangeHeader = Request.Headers.Range.ToString();
            long? rangeStart = null;
            long? rangeEnd = null;

            if (!string.IsNullOrEmpty(rangeHeader))
            {
                // Format: "bytes=0-1023"
                var rangeStr = rangeHeader.Replace("bytes=", "").Split('-');

                if (rangeStr.Length == 2)
                {
                    if (long.TryParse(rangeStr[0], out var start))
                        rangeStart = start;

                    if (long.TryParse(rangeStr[1], out var end))
                        rangeEnd = end;
                }
            }

            // 2. Gọi query để lấy media stream
            var mediaStream = await _mediator.Send(
                new GetMediaStreamQuery(id, rangeStart, rangeEnd));

            if (mediaStream == null)
            {
                _logger.LogWarning($"Media not found: {id}");
                return NotFound(new BaseResponse<string>(message: "Không tìm thấy media này!"));
            }

            // 3. Xác định status code
            int statusCode = 200;
            var response = HttpContext.Response;

            if (rangeStart.HasValue || rangeEnd.HasValue)
            {
                statusCode = 206; // Partial Content
                response.Headers.ContentRange =
                    $"bytes {mediaStream.RangeStart}-{mediaStream.RangeEnd}/{mediaStream.FileSize}";
            }

            // 4. Set response headers
            response.StatusCode = statusCode;
            response.ContentType = mediaStream.ContentType;
            response.ContentLength = (mediaStream.RangeEnd - mediaStream.RangeStart + 1) ?? mediaStream.FileSize;
            response.Headers.CacheControl = "public, max-age=3600"; // Cache 1 hour
            response.Headers.AcceptRanges = "bytes";

            // 5. Return file stream
            return new FileStreamResult(mediaStream.FileStream, mediaStream.ContentType)
            {
                FileDownloadName = mediaStream.FileName,
                EnableRangeProcessing = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error streaming media {id}: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi phát stream media!"));
        }
    }

    /// <summary>
    /// Lấy metadata của một media
    /// </summary>
    /// <param name="id">ID của media</param>
    /// <returns>Metadata của media</returns>
    /// <remarks>
    /// Ví dụ response:
    /// {
    ///   "success": true,
    ///   "data": {
    ///     "id": "550e8400-e29b-41d4-a716-446655440000",
    ///     "title": "Sample Video",
    ///     "duration": 180,
    ///     "contentType": "video/mp4",
    ///     "fileSize": 52428800,
    ///     "lastModified": "2024-06-08T10:30:00Z"
    ///   },
    ///   "message": "Lấy metadata thành công!"
    /// }
    /// </remarks>
    [HttpGet("{id}/metadata")]
    public async Task<IActionResult> GetMediaMetadata(Guid id)
    {
        try
        {
            _logger.LogInformation($"Metadata request for media: {id}");

            // 1. Gọi query để lấy metadata
            var result = await _mediator.Send(new GetMediaMetadataQuery(id));

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting metadata for media {id}: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi lấy metadata media!"));
        }
    }

    /// <summary>
    /// Lấy thông tin chi tiết của một media
    /// </summary>
    /// <param name="id">ID của media</param>
    /// <returns>Thông tin media (title, duration, thumbnail, etc.)</returns>
    [HttpGet("{id}/info")]
    public async Task<IActionResult> GetMediaInfo(Guid id)
    {
        try
        {
            _logger.LogInformation($"Info request for media: {id}");

            // 1. Gọi query để lấy thông tin media
            var result = await _mediator.Send(new GetMediaInfoQuery(id));

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting info for media {id}: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi lấy thông tin media!"));
        }
    }

    /// <summary>
    /// Test endpoint để kiểm tra media controller
    /// </summary>
    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        return Ok(new
        {
            status = "ok",
            message = "Media controller is working",
            timestamp = DateTime.UtcNow
        });
    }
}
