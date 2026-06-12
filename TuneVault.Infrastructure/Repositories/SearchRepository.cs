<<<<<<< HEAD
using Dapper;
using System.Data;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Playlist.DTOs;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class SearchRepository : ISearchRepository
{
    private readonly IDbConnection _db;

    public SearchRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TrackDto>> SearchMediaAsync(
        string keyword)
    {
        const string sql = @"
            SELECT
                m.Id,
                m.Title,
                m.Duration,
                a.Name AS ArtistName,
                al.Title AS AlbumTitle,
                m.ThumbnailUrl
            FROM MediaItem m
            LEFT JOIN Artist a
                ON a.Id = m.ArtistId
            LEFT JOIN Album al
                ON al.Id = m.AlbumId
            WHERE
                m.Title LIKE '%' + @Keyword + '%'
                OR a.Name LIKE '%' + @Keyword + '%'
                OR al.Title LIKE '%' + @Keyword + '%'
            ORDER BY m.Title;";

        return await _db.QueryAsync<TrackDto>(
            sql,
            new { Keyword = keyword });
    }

    public async Task<IEnumerable<ArtistDto>> SearchArtistsAsync(
        string keyword)
    {
        const string sql = @"
            SELECT
                a.Id,
                a.Name,
                a.Biography,
                a.ImageUrl,
                COUNT(m.Id) AS TotalTracks
            FROM Artist a
            LEFT JOIN MediaItem m
                ON m.ArtistId = a.Id
            WHERE a.Name LIKE '%' + @Keyword + '%'
            GROUP BY
                a.Id,
                a.Name,
                a.Biography,
                a.ImageUrl
            ORDER BY a.Name;";

        return await _db.QueryAsync<ArtistDto>(
            sql,
            new { Keyword = keyword });
    }

    public async Task<IEnumerable<PlaylistSearchDto>>
        SearchPlaylistsAsync(string keyword)
    {
        const string sql = @"
            SELECT
                p.Id,
                p.Name,
                p.OwnerId,
                p.IsPublic,
                COUNT(pt.MediaItemId) AS TotalTracks
            FROM Playlist p
            LEFT JOIN PlaylistTrack pt
                ON pt.PlaylistId = p.Id
            WHERE
                p.IsPublic = 1
                AND p.Name LIKE '%' + @Keyword + '%'
            GROUP BY
                p.Id,
                p.Name,
                p.OwnerId,
                p.IsPublic
            ORDER BY p.Name;";

        return await _db.QueryAsync<PlaylistSearchDto>(
            sql,
            new { Keyword = keyword });
=======
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
>>>>>>> 0ca8b5a94c779c737b1f46a2b2f933bab2e5ee93
    }
}
