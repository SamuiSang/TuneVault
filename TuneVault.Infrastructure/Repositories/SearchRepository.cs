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
            LEFT JOIN MediaArtist ma ON ma.MediaItemId = m.Id
            LEFT JOIN Artist a ON a.Id = ma.ArtistId
            LEFT JOIN Album al ON al.Id = m.AlbumId
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
                a.Bio AS Biography,
                a.AvatarUrl AS ImageUrl,
                COUNT(ma.MediaItemId) AS TotalTracks
            FROM Artist a
            LEFT JOIN MediaArtist ma ON ma.ArtistId = a.Id
            WHERE a.Name LIKE '%' + @Keyword + '%'
            GROUP BY
                a.Id,
                a.Name,
                a.Bio,
                a.AvatarUrl
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
    }

    public async Task<IEnumerable<UserSearchDto>> SearchUsersAsync(string keyword)
    {
        const string sql = @"
            SELECT
                Id,
                UserName,
                UserName AS DisplayName,
                AvatarUrl,
                CAST(0 AS BIT) AS IsArtist
            FROM AppUser
            WHERE
                UserName LIKE '%' + @Keyword + '%'
            ORDER BY UserName;";

        return await _db.QueryAsync<UserSearchDto>(
            sql,
            new { Keyword = keyword });
    }
}
