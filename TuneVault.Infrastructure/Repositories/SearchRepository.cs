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
                m.Type,
                COALESCE(a.UserName, o.UserName) AS ArtistName,
                al.Title AS AlbumTitle,
                m.ThumbnailUrl
            FROM MediaItem m
            LEFT JOIN MediaArtist ma ON ma.MediaItemId = m.Id
            LEFT JOIN AppUser a ON a.Id = CAST(ma.ArtistId AS NVARCHAR(450))
            LEFT JOIN AppUser o ON o.Id = m.OwnerId
            LEFT JOIN Album al ON al.Id = m.AlbumId
            WHERE
                m.Title LIKE '%' + @Keyword + '%'
                OR a.UserName LIKE '%' + @Keyword + '%'
                OR o.UserName LIKE '%' + @Keyword + '%'
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
                COALESCE(a.DisplayName, a.UserName) AS Name,
                a.Bio AS Biography,
                a.AvatarUrl AS ImageUrl,
                COUNT(m.Id) AS TotalTracks
            FROM AppUser a
            LEFT JOIN MediaItem m ON m.OwnerId = a.Id
            WHERE a.IsArtist = 1 AND (a.UserName LIKE '%' + @Keyword + '%' OR a.DisplayName LIKE '%' + @Keyword + '%')
            GROUP BY
                a.Id,
                a.UserName,
                a.DisplayName,
                a.Bio,
                a.AvatarUrl
            ORDER BY a.UserName;";

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
                COALESCE(DisplayName, UserName) AS DisplayName,
                AvatarUrl,
                IsArtist
            FROM AppUser
            WHERE
                UserName LIKE '%' + @Keyword + '%' OR DisplayName LIKE '%' + @Keyword + '%'
            ORDER BY UserName;";

        return await _db.QueryAsync<UserSearchDto>(
            sql,
            new { Keyword = keyword });
    }
}
