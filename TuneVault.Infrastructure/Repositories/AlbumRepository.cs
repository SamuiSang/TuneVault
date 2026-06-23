using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class AlbumRepository : IAlbumRepository
{
    private readonly IDbConnection _db;

    public AlbumRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<AlbumDto>> GetAlbumsByArtistIdAsync(string artistId)
    {
        const string sql = @"
            SELECT 
                a.Id,
                a.Title,
                a.ReleaseDate,
                a.CoverImageUrl,
                a.ArtistId,
                u.DisplayName AS ArtistName
            FROM Album a
            INNER JOIN AppUser u ON a.ArtistId = u.Id
            WHERE a.ArtistId = @ArtistId
            ORDER BY a.ReleaseDate DESC";

        return await _db.QueryAsync<AlbumDto>(sql, new { ArtistId = artistId });
    }

    public async Task<AlbumDetailDto?> GetAlbumByIdAsync(Guid albumId)
    {
        const string albumSql = @"
            SELECT 
                a.Id,
                a.Title,
                a.ReleaseDate,
                a.CoverImageUrl,
                a.ArtistId,
                u.DisplayName AS ArtistName
            FROM Album a
            INNER JOIN AppUser u ON a.ArtistId = u.Id
            WHERE a.Id = @AlbumId";

        var album = await _db.QueryFirstOrDefaultAsync<AlbumDetailDto>(albumSql, new { AlbumId = albumId });
        
        if (album == null)
            return null;

        const string tracksSql = @"
            SELECT 
                m.Id,
                m.Title,
                m.ThumbnailUrl,
                m.Type,
                m.Duration,
                m.FilePath,
                m.OwnerId,
                COALESCE(u.DisplayName, u.UserName) AS OwnerName
            FROM MediaItem m
            INNER JOIN AppUser u ON m.OwnerId = u.Id
            WHERE m.AlbumId = @AlbumId";

        var tracks = await _db.QueryAsync<AlbumTrackDto>(tracksSql, new { AlbumId = albumId });
        album.Tracks = tracks;

        return album;
    }
}
