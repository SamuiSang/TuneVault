using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories;

public class MediaShareRepository : IMediaShareRepository
{
    private readonly IDbConnection _dbConnection;

    public MediaShareRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<Guid> CreateMediaShareAsync(CreateMediaShareRequest request, CancellationToken cancellationToken = default)
    {
        var shareId = Guid.NewGuid();

        const string query = @"
            INSERT INTO MediaShare (Id, SharedAt, SenderId, ReceiverId, MediaItemId, PlaylistId)
            VALUES (@Id, @SharedAt, @SenderId, @ReceiverId, @MediaItemId, @PlaylistId)";

        await _dbConnection.ExecuteAsync(query, new
        {
            Id = shareId,
            SharedAt = DateTime.UtcNow,
            request.SenderId,
            request.ReceiverId,
            request.MediaItemId,
            request.PlaylistId
        });

        return shareId;
    }
}
