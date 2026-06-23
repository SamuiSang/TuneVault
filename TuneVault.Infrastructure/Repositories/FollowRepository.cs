using Dapper;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class FollowRepository : IFollowRepository
{
    private readonly IDbConnection _db;

    public FollowRepository(IDbConnection db)
    {
        _db = db;
    }

    #region Follow Commands
    // 1. Thêm hàm ExistsAsync
    public async Task<bool> ExistsAsync(string followerId, string followingId)
    {
        var sql = @"SELECT COUNT(1) 
                    FROM UserFollows 
                    WHERE FollowerId = @FollowerId AND FollowingId = @FollowingId";
                    
        return await _db.ExecuteScalarAsync<int>(sql, new { FollowerId = followerId, FollowingId = followingId }) > 0;
    }

    // 2. Thêm hàm CreateAsync
    public async Task<object> CreateAsync(Follow follow)
    {
        var sql = @"INSERT INTO UserFollows (FollowerId, FollowingId, CreatedAt) 
                    VALUES (@FollowerId, @FollowingId, @CreatedAt)";
                    
        var rowsAffected = await _db.ExecuteAsync(sql, follow);
        
        // Trả về kết quả (C# sẽ tự động box kiểu bool này thành object để khớp với Interface)
        return rowsAffected > 0; 
    }

    public async Task<Guid> FollowUserAsync(string followerId, string followeeId)
    {
        const string sql = @"
            IF NOT EXISTS (SELECT 1 FROM Follow WHERE FollowerId = @FollowerId AND FolloweeId = @FolloweeId)
            BEGIN
                DECLARE @NewId UNIQUEIDENTIFIER = NEWID();
                INSERT INTO Follow (Id, FollowerId, FolloweeId, ArtistId, CreatedAt)
                VALUES (@NewId, @FollowerId, @FolloweeId, NULL, GETDATE());
                SELECT @NewId;
            END
            ELSE
                SELECT Id FROM Follow WHERE FollowerId = @FollowerId AND FolloweeId = @FolloweeId;";

        return await _db.ExecuteScalarAsync<Guid>(sql, new { FollowerId = followerId, FolloweeId = followeeId });
    }

    public async Task<Guid> FollowArtistAsync(string followerId, string artistId)
    {
        const string sql = @"
            IF NOT EXISTS (SELECT 1 FROM Follow WHERE FollowerId = @FollowerId AND FolloweeId = @ArtistId)
            BEGIN
                DECLARE @NewId UNIQUEIDENTIFIER = NEWID();
                INSERT INTO Follow (Id, FollowerId, FolloweeId, CreatedAt)
                VALUES (@NewId, @FollowerId, @ArtistId, GETDATE());
                SELECT @NewId;
            END
            ELSE
                SELECT Id FROM Follow WHERE FollowerId = @FollowerId AND FolloweeId = @ArtistId;";

        return await _db.ExecuteScalarAsync<Guid>(sql, new { FollowerId = followerId, ArtistId = artistId });
    }

    public async Task<bool> UnfollowUserAsync(string followerId, string followeeId)
    {
        const string sql = @"
            DELETE FROM Follow
            WHERE FollowerId = @FollowerId 
              AND FolloweeId = @FolloweeId;";

        var rowsAffected = await _db.ExecuteAsync(sql, new { FollowerId = followerId, FolloweeId = followeeId });
        return rowsAffected > 0;
    }

    public async Task<bool> UnfollowArtistAsync(string followerId, string artistId)
    {
        const string sql = @"
            DELETE FROM Follow
            WHERE FollowerId = @FollowerId 
              AND FolloweeId = @ArtistId;";

        var rowsAffected = await _db.ExecuteAsync(sql, new { FollowerId = followerId, ArtistId = artistId });
        return rowsAffected > 0;
    }

    #endregion

    #region Follow Queries - Check Following

    public async Task<bool> IsFollowingUserAsync(string followerId, string followeeId)
    {
        const string sql = @"
            SELECT CASE WHEN EXISTS(
                SELECT 1 FROM Follow
                WHERE FollowerId = @FollowerId 
                  AND FolloweeId = @FolloweeId
            ) THEN 1 ELSE 0 END;";

        var result = await _db.QueryFirstOrDefaultAsync<int>(sql, new { FollowerId = followerId, FolloweeId = followeeId });
        return result == 1;
    }

    public async Task<bool> IsFollowingArtistAsync(string followerId, string artistId)
    {
        const string sql = @"
            SELECT CASE WHEN EXISTS(
                SELECT 1 FROM Follow
                WHERE FollowerId = @FollowerId 
                  AND FolloweeId = @ArtistId
            ) THEN 1 ELSE 0 END;";

        var result = await _db.QueryFirstOrDefaultAsync<int>(sql, new { FollowerId = followerId, ArtistId = artistId });
        return result == 1;
    }

    #endregion

    #region Follow Queries - Get Following

    public async Task<IEnumerable<FollowingUserDto>> GetFollowingUsersAsync(string followerId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                u.Id,
                u.UserName,
                u.Email,
                u.Bio,
                u.AvatarUrl,
                f.CreatedAt as FollowedAt
            FROM Follow f
            INNER JOIN AppUser u ON f.FolloweeId = u.Id
            WHERE f.FollowerId = @FollowerId AND f.FolloweeId IS NOT NULL AND u.IsArtist = 0
            ORDER BY f.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<FollowingUserDto>(sql, new 
        { 
            FollowerId = followerId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    public async Task<IEnumerable<FollowingArtistDto>> GetFollowingArtistsAsync(string followerId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                a.Id,
                COALESCE(a.DisplayName, a.UserName) AS Name,
                a.Bio,
                a.AvatarUrl,
                f.CreatedAt as FollowedAt
            FROM Follow f
            INNER JOIN AppUser a ON f.FolloweeId = a.Id
            WHERE f.FollowerId = @FollowerId AND f.FolloweeId IS NOT NULL AND a.IsArtist = 1
            ORDER BY f.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<FollowingArtistDto>(sql, new 
        { 
            FollowerId = followerId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    #endregion

    #region Follow Queries - Get Followers

    public async Task<IEnumerable<FollowerUserDto>> GetUserFollowersAsync(string followeeId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                u.Id,
                u.UserName,
                u.Bio,
                u.AvatarUrl,
                f.CreatedAt as FollowedAt
            FROM Follow f
            INNER JOIN AppUser u ON f.FollowerId = u.Id
            WHERE f.FolloweeId = @FolloweeId AND f.FolloweeId IS NOT NULL AND (SELECT IsArtist FROM AppUser WHERE Id = @FolloweeId) = 0
            ORDER BY f.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<FollowerUserDto>(sql, new 
        { 
            FolloweeId = followeeId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    public async Task<IEnumerable<FollowerUserDto>> GetArtistFollowersAsync(string artistId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                u.Id,
                u.UserName,
                u.Bio,
                u.AvatarUrl,
                f.CreatedAt as FollowedAt
            FROM Follow f
            INNER JOIN AppUser u ON f.FollowerId = u.Id
            WHERE f.FolloweeId = @ArtistId AND f.FolloweeId IS NOT NULL
            ORDER BY f.CreatedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<FollowerUserDto>(sql, new 
        { 
            ArtistId = artistId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    #endregion

    #region Follow Queries - Statistics

    public async Task<int> GetUserFollowerCountAsync(string followeeId)
    {
        const string sql = @"
            SELECT COUNT(*) FROM Follow
            WHERE FolloweeId = @FolloweeId AND FolloweeId IS NOT NULL;";

        return await _db.QueryFirstOrDefaultAsync<int>(sql, new { FolloweeId = followeeId });
    }

    public async Task<int> GetArtistFollowerCountAsync(string artistId)
    {
        const string sql = @"
            SELECT COUNT(*) FROM Follow
            WHERE FolloweeId = @ArtistId AND FolloweeId IS NOT NULL;";

        return await _db.QueryFirstOrDefaultAsync<int>(sql, new { ArtistId = artistId });
    }

    public async Task<FollowStatsDto> GetFollowStatsAsync(string userId)
    {
        const string sql = @"
            -- 1. Lấy số lượng người mà User này đang theo dõi (User khác & Artist)
            SELECT 
                COALESCE(SUM(CASE WHEN a.IsArtist = 0 THEN 1 ELSE 0 END), 0) as FollowingUserCount,
                COALESCE(SUM(CASE WHEN a.IsArtist = 1 THEN 1 ELSE 0 END), 0) as FollowingArtistCount
            FROM Follow f
            INNER JOIN AppUser a ON f.FolloweeId = a.Id
            WHERE f.FollowerId = @UserId;

            -- 2. Lấy số lượng Fans/Followers đang theo dõi chính User này
            SELECT COALESCE(COUNT(*), 0) as FollowerCount
            FROM Follow
            WHERE FolloweeId = @UserId AND FolloweeId IS NOT NULL;";

        using var multi = await _db.QueryMultipleAsync(sql, new { UserId = userId });
        
        var followingStats = await multi.ReadFirstOrDefaultAsync<(int FollowingUserCount, int FollowingArtistCount)>();
        var followerCount = await multi.ReadFirstOrDefaultAsync<int>();

        return new FollowStatsDto
        {
            FollowingUserCount = followingStats.FollowingUserCount,
            FollowingArtistCount = followingStats.FollowingArtistCount,
            FollowerCount = followerCount
        };
    }

    #endregion
}