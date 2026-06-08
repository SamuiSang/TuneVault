using System.Data;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Infrastructure.Repositories;

/// <summary>
/// Repository cho tìm kiếm media/artist/playlist (sẽ triển khai sau)
/// </summary>
public class SearchRepository : ISearchRepository
{
    private readonly IDbConnection _dbConnection;

    public SearchRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }
}
