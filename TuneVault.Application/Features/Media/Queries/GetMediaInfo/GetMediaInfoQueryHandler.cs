using MediatR;
using Microsoft.Extensions.Logging;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Media.DTOs;
using TuneVault.Application.Features.Media.Queries.GetMediaInfo;

namespace TuneVault.Application.Features.Media.Queries;

/// <summary>
/// Handler cho GetMediaInfoQuery
/// Lấy thông tin chi tiết của media
/// </summary>
public class GetMediaInfoQueryHandler : IRequestHandler<GetMediaInfoQuery, BaseResponse<MediaInfoDto>>
{
    private readonly IMediaRepository _mediaRepository;
    private readonly ILogger<GetMediaInfoQueryHandler> _logger;

    public GetMediaInfoQueryHandler(IMediaRepository mediaRepository, ILogger<GetMediaInfoQueryHandler> logger)
    {
        _mediaRepository = mediaRepository;
        _logger = logger;
    }

    public async Task<BaseResponse<MediaInfoDto>> Handle(GetMediaInfoQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Lấy thông tin media từ repository
            var media = await _mediaRepository.GetMediaByIdAsync(request.MediaId, cancellationToken);

            if (media == null)
            {
                _logger.LogWarning($"Media not found: {request.MediaId}");
                return new BaseResponse<MediaInfoDto>(message: "Không tìm thấy media này!");
            }

            // 2. Map repository response sang DTO
            var mediaInfoDto = new MediaInfoDto(
                Id: media.Id,
                Title: media.Title,
                Description: media.Description,
                Type: media.Type,
                Duration: media.Duration,
                ThumbnailUrl: media.ThumbnailUrl,
                AlbumId: media.AlbumId,
                OwnerId: media.OwnerId
            );

            _logger.LogInformation($"Retrieved info for media {request.MediaId}");

            return new BaseResponse<MediaInfoDto>(
                data: mediaInfoDto,
                success: true,
                message: "Lấy thông tin media thành công!"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting media info {request.MediaId}: {ex.Message}");
            return new BaseResponse<MediaInfoDto>(
                message: $"Lỗi khi lấy thông tin media: {ex.Message}"
            );
        }
    }
}
