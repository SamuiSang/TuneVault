using Dapper;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class PlayHistoryRepository : IPlayHistoryRepository
{
    private readonly IDbConnection _db;

    public PlayHistoryRepository(IDbConnection db)
    {
        _db = db;   
    }

    public async Task<Guid> AddPlayHistoryAsync(string userId, Guid mediaItemId)
    {
        var id = Guid.NewGuid();
        const string sql = @"
            INSERT INTO PlayHistory (Id, UserId, MediaItemId, PlayedAt)
            VALUES (@Id, @UserId, @MediaItemId, GETDATE());";

        await _db.ExecuteAsync(sql, new 
        { 
            Id = id,
            UserId = userId, 
            MediaItemId = mediaItemId 
        });

        return id;
    }

    public async Task<bool> RemovePlayHistoryAsync(Guid playHistoryId)
    {
        const string sql = @"
            DELETE FROM PlayHistory WHERE Id = @Id;";

        var rowsAffected = await _db.ExecuteAsync(sql, new { Id = playHistoryId });
        return rowsAffected > 0;
    }

    public async Task<IEnumerable<PlayHistoryDetailDto>> GetUserPlayHistoryAsync(string userId, int pageNumber = 1, int pageSize = 10)
    {
        const string sql = @"
            DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
            
            SELECT 
                ph.Id,
                m.Id as MediaId,
                m.Title,
                m.Duration,
                m.Type,
                ph.PlayedAt
            FROM PlayHistory ph
            INNER JOIN MediaItem m ON ph.MediaItemId = m.Id
            WHERE ph.UserId = @UserId
            ORDER BY ph.PlayedAt DESC
            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        return await _db.QueryAsync<PlayHistoryDetailDto>(sql, new 
        { 
            UserId = userId, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        });
    }

    public async Task<IEnumerable<TopPlayedMediaDto>> GetTopPlayedMediaAsync(string userId, int limit = 10)
    {
        const string sql = @"
            SELECT TOP (@Limit)
                m.Id,
                m.Title,
                m.Duration,
                m.Type,
                COUNT(*) as PlayCount
            FROM PlayHistory ph
            INNER JOIN MediaItem m ON ph.MediaItemId = m.Id
            WHERE ph.UserId = @UserId
            GROUP BY m.Id, m.Title, m.Duration, m.Type
            ORDER BY PlayCount DESC;";

        return await _db.QueryAsync<TopPlayedMediaDto>(sql, new 
        { 
            UserId = userId, 
            Limit = limit 
        });
    }

    public async Task<int> GetPlayHistoryCountAsync(string userId)
    {
        const string sql = @"
            SELECT COUNT(*) FROM PlayHistory WHERE UserId = @UserId;";

        return await _db.QueryFirstOrDefaultAsync<int>(sql, new { UserId = userId });
    }
}
