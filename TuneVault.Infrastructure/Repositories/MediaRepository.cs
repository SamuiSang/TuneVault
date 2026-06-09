using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories;

/// <summary>
/// Implementation của IMediaRepository sử dụng Dapper
/// </summary>
public class MediaRepository : IMediaRepository
{
    private readonly IDbConnection _dbConnection;

    public MediaRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    /// <summary>
    /// Lấy thông tin chi tiết một media item
    /// </summary>
    public async Task<GetMediaResponse?> GetMediaByIdAsync(Guid mediaId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT Id, Title, Description, Type, Duration, ThumbnailUrl, AlbumId, OwnerId
            FROM MediaItem
            WHERE Id = @Id";

        var media = await _dbConnection.QuerySingleOrDefaultAsync<GetMediaResponse>(
            query,
            new { Id = mediaId });

        return media;
    }

    /// <summary>
    /// Lấy file path của media để stream
    /// </summary>
    public async Task<string?> GetMediaFilePathAsync(Guid mediaId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT FilePath
            FROM MediaItem
            WHERE Id = @Id";

        var filePath = await _dbConnection.QuerySingleOrDefaultAsync<string>(
            query,
            new { Id = mediaId });

        return filePath;
    }

    /// <summary>
    /// Lấy metadata của media (kích thước file, duration, v.v.)
    /// </summary>
    public async Task<GetMediaMetadataResponse?> GetMediaMetadataAsync(Guid mediaId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT Id, Title, Duration, FilePath, Type as ContentType, 0 as FileSize
            FROM MediaItem
            WHERE Id = @Id";

        var metadata = await _dbConnection.QuerySingleOrDefaultAsync<GetMediaMetadataResponse>(
            query,
            new { Id = mediaId });

        return metadata;
    }

    /// <summary>
    /// Tạo mới một media item
    /// </summary>
    public async Task<Guid> CreateMediaAsync(CreateMediaRequest media, CancellationToken cancellationToken = default)
    {
        var mediaId = Guid.NewGuid();

        const string query = @"
            INSERT INTO MediaItem (Id, Title, Description, Type, Duration, FilePath, ThumbnailUrl, AlbumId, OwnerId)
            VALUES (@Id, @Title, @Description, @Type, @Duration, @FilePath, @ThumbnailUrl, @AlbumId, @OwnerId)";

        var parameters = new
        {
            Id = mediaId,
            Title = media.Title,
            Description = media.Description,
            Type = media.Type,
            Duration = media.Duration,
            FilePath = media.FilePath,
            ThumbnailUrl = media.ThumbnailUrl,
            AlbumId = media.AlbumId,
            OwnerId = media.OwnerId
        };

        await _dbConnection.ExecuteAsync(query, parameters);
        return mediaId;
    }

    /// <summary>
    /// Cập nhật metadata của media
    /// </summary>
    public async Task<bool> UpdateMediaAsync(Guid mediaId, UpdateMediaRequest media, CancellationToken cancellationToken = default)
    {
        var setClause = new List<string>();
        var parameters = new DynamicParameters();
        parameters.Add("@Id", mediaId);

        if (!string.IsNullOrEmpty(media.Title))
        {
            setClause.Add("Title = @Title");
            parameters.Add("@Title", media.Title);
        }

        if (!string.IsNullOrEmpty(media.Description))
        {
            setClause.Add("Description = @Description");
            parameters.Add("@Description", media.Description);
        }

        if (!string.IsNullOrEmpty(media.ThumbnailUrl))
        {
            setClause.Add("ThumbnailUrl = @ThumbnailUrl");
            parameters.Add("@ThumbnailUrl", media.ThumbnailUrl);
        }

        if (setClause.Count == 0)
            return true; // Không có gì để cập nhật

        var query = $"UPDATE MediaItem SET {string.Join(", ", setClause)} WHERE Id = @Id";
        var rowsAffected = await _dbConnection.ExecuteAsync(query, parameters);

        return rowsAffected > 0;
    }

    /// <summary>
    /// Lấy danh sách media của một artist
    /// </summary>
    public async Task<List<GetMediaResponse>> GetMediaByArtistAsync(Guid artistId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT DISTINCT m.Id, m.Title, m.Description, m.Type, m.Duration, m.ThumbnailUrl, m.AlbumId, m.OwnerId
            FROM MediaItem m
            INNER JOIN MediaArtist ma ON m.Id = ma.MediaItemId
            WHERE ma.ArtistId = @ArtistId
            ORDER BY m.Title";

        var media = await _dbConnection.QueryAsync<GetMediaResponse>(
            query,
            new { ArtistId = artistId });

        return media.ToList();
    }

    /// <summary>
    /// Lấy danh sách media của một album
    /// </summary>
    public async Task<List<GetMediaResponse>> GetMediaByAlbumAsync(Guid albumId, CancellationToken cancellationToken = default)
    {
        const string query = @"
            SELECT Id, Title, Description, Type, Duration, ThumbnailUrl, AlbumId, OwnerId
            FROM MediaItem
            WHERE AlbumId = @AlbumId
            ORDER BY Title";

        var media = await _dbConnection.QueryAsync<GetMediaResponse>(
            query,
            new { AlbumId = albumId });

        return media.ToList();
    }
}
