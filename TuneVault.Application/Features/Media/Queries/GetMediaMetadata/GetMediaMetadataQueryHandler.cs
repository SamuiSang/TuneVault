using MediatR;
using Microsoft.Extensions.Logging;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Media.DTOs;
using TuneVault.Application.Features.Media.Queries.GetMediaMetadata;

namespace TuneVault.Application.Features.Media.Queries;

/// <summary>
/// Handler cho GetMediaMetadataQuery
/// Lấy metadata của media từ database
/// </summary>
public class GetMediaMetadataQueryHandler : IRequestHandler<GetMediaMetadataQuery, BaseResponse<MediaMetadataDto>>
{
    private readonly IMediaRepository _mediaRepository;
    private readonly ILogger<GetMediaMetadataQueryHandler> _logger;

    public GetMediaMetadataQueryHandler(IMediaRepository mediaRepository, ILogger<GetMediaMetadataQueryHandler> logger)
    {
        _mediaRepository = mediaRepository;
        _logger = logger;
    }

    public async Task<BaseResponse<MediaMetadataDto>> Handle(GetMediaMetadataQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Lấy metadata từ repository
            var metadata = await _mediaRepository.GetMediaMetadataAsync(request.MediaId, cancellationToken);

            if (metadata == null)
            {
                _logger.LogWarning($"Media metadata not found: {request.MediaId}");
                return new BaseResponse<MediaMetadataDto>(message: "Không tìm thấy media này!");
            }

            // 2. Lấy file size từ disk (nếu có)
            var filePath = await _mediaRepository.GetMediaFilePathAsync(request.MediaId, cancellationToken);
            var fileSize = 0L;
            var lastModified = DateTime.UtcNow;

            if (filePath != null && File.Exists(filePath))
            {
                var fileInfo = new FileInfo(filePath);
                fileSize = fileInfo.Length;
                lastModified = fileInfo.LastWriteTimeUtc;
            }

            // 3. Tạo response DTO
            var metadataDto = new MediaMetadataDto(
                Id: metadata.Id,
                Title: metadata.Title,
                Duration: metadata.Duration,
                ContentType: metadata.ContentType,
                FileSize: fileSize,
                LastModified: lastModified
            );

            _logger.LogInformation($"Retrieved metadata for media {request.MediaId}");

            return new BaseResponse<MediaMetadataDto>(
                data: metadataDto,
                success: true,
                message: "Lấy metadata thành công!"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting media metadata {request.MediaId}: {ex.Message}");
            return new BaseResponse<MediaMetadataDto>(
                message: $"Lỗi khi lấy metadata: {ex.Message}"
            );
        }
    }
}
