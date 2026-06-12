namespace TuneVault.Application.Features.Media.DTOs;

/// <summary>
/// DTO cho thông tin media
/// </summary>
public record MediaInfoDto(
    Guid Id,
    string Title,
    string? Description,
    string Type, // "Audio" hoặc "Video"
    int Duration, // seconds
    string? ThumbnailUrl,
    Guid? AlbumId,
    string OwnerId
);

/// <summary>
/// DTO cho metadata của media (dùng cho streaming)
/// </summary>
public record MediaMetadataDto(
    Guid Id,
    string Title,
    int Duration,
    string ContentType, // MIME type
    long FileSize, // bytes
    DateTime LastModified
);
