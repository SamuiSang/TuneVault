using Dapper;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly IDbConnection _db;

    public FavoriteRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<bool> AddFavoriteAsync(string userId, Guid mediaItemId)
    {
        // Kiểm tra xem đã tồn tại chưa trước khi chèn để bảo vệ hệ thống
        const string sql = @"
            IF NOT EXISTS (SELECT 1 FROM Favorite WHERE UserId = @UserId AND MediaItemId = @MediaItemId)
            BEGIN
                INSERT INTO Favorite (UserId, MediaItemId, CreatedAt)
                VALUES (@UserId, @MediaItemId, GETDATE());
                SELECT 1;
            END
            ELSE 
                SELECT 0;";

        var rowsAffected = await _db.ExecuteScalarAsync<int>(sql, new { UserId = userId, MediaItemId = mediaItemId });
        return rowsAffected > 0;
    }

    public async Task<bool> RemoveFavoriteAsync(string userId, Guid mediaItemId)
    {
        const string sql = @"
            DELETE FROM Favorite
            WHERE UserId = @UserId AND MediaItemId = @MediaItemId;";

        var rowsAffected = await _db.ExecuteAsync(sql, new { UserId = userId, MediaItemId = mediaItemId });
        return rowsAffected > 0;
    }

    public async Task<bool> IsFavoriteAsync(string userId, Guid mediaItemId)
    {
        const string sql = @"
            SELECT CASE WHEN EXISTS(
                SELECT 1 FROM Favorite 
                WHERE UserId = @UserId AND MediaItemId = @MediaItemId
            ) THEN 1 ELSE 0 END;";

        var result = await _db.QueryFirstOrDefaultAsync<int>(sql, new { UserId = userId, MediaItemId = mediaItemId });
        return result == 1;
    }

    public async Task<IEnumerable<FavoriteMediaDto>> GetUserFavoritesAsync(string userId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                m.Id,
                m.Title,
                m.Duration,
                m.Type,
                m.FilePath,
                f.CreatedAt as FavoritedAt
            FROM Favorite f
            INNER JOIN MediaItem m ON f.MediaItemId = m.Id
            WHERE f.UserId = @UserId
            ORDER BY f.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<FavoriteMediaDto>(sql, new 
        { 
            UserId = userId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    public async Task<int> GetUserFavoritesCountAsync(string userId)
    {
        const string sql = @"
            SELECT COUNT(*) FROM Favorite WHERE UserId = @UserId;";

        return await _db.QueryFirstOrDefaultAsync<int>(sql, new { UserId = userId });
    }
}