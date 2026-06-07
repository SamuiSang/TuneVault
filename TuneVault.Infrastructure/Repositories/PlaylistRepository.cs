using Dapper;
using System.Data;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Infrastructure.Repositories;

public class PlaylistRepository : IPlaylistRepository
{
    private readonly IDbConnection _db;

    public PlaylistRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<Guid> CreateAsync(Playlists playlist)
    {
        const string sql = @"
            INSERT INTO Playlist
            (
                Id,
                Name,
                OwnerId,
                IsPublic,
                CreatedAt
            )
            VALUES
            (
                @Id,
                @Name,
                @OwnerId,
                @IsPublic,
                @CreatedAt
            );";

        await _db.ExecuteAsync(sql, playlist);

        return playlist.Id;
    }

    public async Task UpdateAsync(Playlists playlist)
    {
        const string sql = @"
            UPDATE Playlist
            SET
                Name = @Name,
                IsPublic = @IsPublic
            WHERE Id = @Id
              AND OwnerId = @OwnerId;";

        await _db.ExecuteAsync(sql, playlist);
    }

    public async Task DeleteAsync(Guid playlistId)
    {
        const string sql = @"
            DELETE FROM PlaylistTrack
            WHERE PlaylistId = @PlaylistId;

            DELETE FROM Playlist
            WHERE Id = @PlaylistId;";

        await _db.ExecuteAsync(sql,
            new { PlaylistId = playlistId });
    }

    public async Task AddTrackAsync(
        Guid playlistId,
        Guid mediaItemId)
    {
        const string sql = @"
            INSERT INTO PlaylistTrack
            (
                PlaylistId,
                MediaItemId
            )
            VALUES
            (
                @PlaylistId,
                @MediaItemId
            );";

        await _db.ExecuteAsync(sql,
            new
            {
                PlaylistId = playlistId,
                MediaItemId = mediaItemId
            });
    }

    public async Task RemoveTrackAsync(
        Guid playlistId,
        Guid mediaItemId)
    {
        const string sql = @"
            DELETE FROM PlaylistTrack
            WHERE PlaylistId = @PlaylistId
              AND MediaItemId = @MediaItemId;";

        await _db.ExecuteAsync(sql,
            new
            {
                PlaylistId = playlistId,
                MediaItemId = mediaItemId
            });
    }

    public async Task<IEnumerable<PlaylistDto>>
        GetUserPlaylistsAsync(string userId)
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
            WHERE p.OwnerId = @UserId
            GROUP BY
                p.Id,
                p.Name,
                p.OwnerId,
                p.IsPublic
            ORDER BY p.Name;";

        return await _db.QueryAsync<PlaylistDto>(
            sql,
            new { UserId = userId });
    }

    public async Task<PlaylistDetailDto?>
        GetPlaylistDetailAsync(Guid playlistId)
    {
        const string playlistSql = @"
            SELECT
                Id,
                Name,
                OwnerId,
                IsPublic
            FROM Playlist
            WHERE Id = @PlaylistId;";

        var playlist = await _db.QueryFirstOrDefaultAsync<PlaylistDetailDto>(
            playlistSql,
            new { PlaylistId = playlistId });

        if (playlist == null)
            return null;

        const string trackSql = @"
            SELECT
                m.Id,
                m.Title,
                m.Duration,
                a.Name AS ArtistName,
                al.Title AS AlbumTitle,
                m.ThumbnailUrl
            FROM PlaylistTrack pt
            INNER JOIN MediaItem m
                ON m.Id = pt.MediaItemId
            LEFT JOIN Artist a
                ON a.Id = m.ArtistId
            LEFT JOIN Album al
                ON al.Id = m.AlbumId
            WHERE pt.PlaylistId = @PlaylistId;";

        var tracks = await _db.QueryAsync<TrackDto>(
            trackSql,
            new { PlaylistId = playlistId });

        playlist.Tracks = tracks.ToList();
        playlist.TotalTracks = tracks.Count();

        return playlist;
    }
}