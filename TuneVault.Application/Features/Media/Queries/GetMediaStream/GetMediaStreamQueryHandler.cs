using MediatR;
using Microsoft.Extensions.Logging;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Media.DTOs;
using TuneVault.Application.Features.Media.Queries.GetMediaStream;

namespace TuneVault.Application.Features.Media.Queries;

/// <summary>
/// Handler cho GetMediaStreamQuery
/// Lấy file stream từ disk
/// </summary>
public class GetMediaStreamQueryHandler : IRequestHandler<GetMediaStreamQuery, MediaStreamDto?>
{
    private readonly IMediaRepository _mediaRepository;
    private readonly ILogger<GetMediaStreamQueryHandler> _logger;

    public GetMediaStreamQueryHandler(IMediaRepository mediaRepository, ILogger<GetMediaStreamQueryHandler> logger)
    {
        _mediaRepository = mediaRepository;
        _logger = logger;
    }

    public async Task<MediaStreamDto?> Handle(GetMediaStreamQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Lấy file path từ database
            var filePath = await _mediaRepository.GetMediaFilePathAsync(request.MediaId, cancellationToken);

            if (filePath == null || !File.Exists(filePath))
            {
                _logger.LogWarning($"Media file not found: {request.MediaId} at path {filePath}");
                return null;
            }

            // 2. Lấy file info
            var fileInfo = new FileInfo(filePath);
            var fileSize = fileInfo.Length;

            // 3. Xác định range nếu có
            var rangeStart = request.RangeStart ?? 0;
            var rangeEnd = request.RangeEnd ?? (fileSize - 1);

            // Validate range
            if (rangeStart >= fileSize || rangeEnd >= fileSize || rangeStart > rangeEnd)
            {
                rangeStart = 0;
                rangeEnd = fileSize - 1;
            }

            // 4. Mở file stream
            var fileStream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                bufferSize: 81920, // 80KB buffer
                useAsync: true);

            // Nếu có range, seek tới vị trí bắt đầu
            if (rangeStart > 0)
            {
                fileStream.Seek(rangeStart, SeekOrigin.Begin);
            }

            // 5. Xác định content type
            var contentType = GetContentType(filePath);

            _logger.LogInformation(
                $"Streaming media {request.MediaId} | " +
                $"Range: {rangeStart}-{rangeEnd} | " +
                $"Size: {fileSize}");

            return new MediaStreamDto
            {
                FileStream = fileStream,
                ContentType = contentType,
                FileName = fileInfo.Name,
                FileSize = fileSize,
                RangeStart = rangeStart,
                RangeEnd = rangeEnd
            };
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error streaming media {request.MediaId}: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Xác định MIME type dựa vào file extension
    /// </summary>
    private static string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();

        return extension switch
        {
            // Audio
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".flac" => "audio/flac",
            ".aac" => "audio/aac",
            ".ogg" => "audio/ogg",
            ".m4a" => "audio/mp4",

            // Video
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".mkv" => "video/x-matroska",
            ".avi" => "video/x-msvideo",
            ".mov" => "video/quicktime",
            ".flv" => "video/x-flv",

            _ => "application/octet-stream"
        };
    }
}
