using System;
using System.Threading;
using System.Threading.Tasks;
namespace TuneVault.Application.Common.Interfaces.Repositories;

/// <summary>
/// Repository interface cho Media entity
/// Quản lý các file media (audio/video) và streaming
/// </summary>
public interface IMediaRepository
{
    /// <summary>
    /// Lấy thông tin chi tiết một media item
    /// </summary>
    /// <param name="mediaId">ID của media item</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Thông tin media</returns>
    Task<GetMediaResponse?> GetMediaByIdAsync(Guid mediaId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy file path của media để stream
    /// </summary>
    /// <param name="mediaId">ID của media item</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>File path của media</returns>
    Task<string?> GetMediaFilePathAsync(Guid mediaId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy metadata của media (kích thước file, duration, v.v.)
    /// </summary>
    /// <param name="mediaId">ID của media item</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Metadata của media</returns>
    Task<GetMediaMetadataResponse?> GetMediaMetadataAsync(Guid mediaId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Tạo mới một media item
    /// </summary>
    /// <param name="media">Dữ liệu media</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>ID của media vừa tạo</returns>
    Task<Guid> CreateMediaAsync(CreateMediaRequest media, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cập nhật metadata của media (description, thumbnail, v.v.)
    /// </summary>
    /// <param name="mediaId">ID của media</param>
    /// <param name="media">Dữ liệu cập nhật</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True nếu thành công</returns>
    Task<bool> UpdateMediaAsync(Guid mediaId, UpdateMediaRequest media, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy danh sách media của một artist
    /// </summary>
    /// <param name="artistId">ID của artist</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Danh sách media</returns>
    Task<List<GetMediaResponse>> GetMediaByArtistAsync(string artistId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lấy danh sách media của một album
    /// </summary>
    /// <param name="albumId">ID của album</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Danh sách media</returns>
    Task<List<GetMediaResponse>> GetMediaByAlbumAsync(Guid albumId, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

/// <summary>
/// Response model cho media item
/// </summary>
public record GetMediaResponse(
    Guid Id,
    string Title,
    string? Description,
    string Type,
    int Duration,
    string? ThumbnailUrl,
    Guid? AlbumId,
    string OwnerId
);

/// <summary>
/// Response model cho media metadata
/// </summary>
public record GetMediaMetadataResponse(
    Guid Id,
    string Title,
    int Duration,
    string FilePath,
    string ContentType,
    long FileSize
);

/// <summary>
/// Request model để tạo media
/// </summary>
public record CreateMediaRequest(
    string Title,
    string Type, // "Audio" hoặc "Video"
    int Duration,
    string FilePath,
    Guid? AlbumId,
    string OwnerId,
    string? ThumbnailUrl = null,
    string? Description = null
);

/// <summary>
/// Request model để cập nhật media
/// </summary>
public record UpdateMediaRequest(
    string? Title = null,
    string? Description = null,
    string? ThumbnailUrl = null
);
