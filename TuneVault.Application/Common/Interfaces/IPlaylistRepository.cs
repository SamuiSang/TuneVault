using TuneVault.Application.Features.Playlist.DTOs;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Common.Interfaces;

public interface IPlaylistRepository
{
    // Playlist Commands

    Task<Guid> CreateAsync(Playlist playlist);

    Task UpdateAsync(Playlist playlist);

    Task DeleteAsync(Guid playlistId);

    // Playlist Tracks

    Task AddTrackAsync(
        Guid playlistId,
        Guid mediaItemId);

    Task RemoveTrackAsync(
        Guid playlistId,
        Guid mediaItemId);

    // Playlist Queries

    Task<PlaylistDetailDto?> GetPlaylistDetailAsync(Guid playlistId);

    Task<IEnumerable<PlaylistDto>> GetUserPlaylistAsync(string userId);
    Task<Playlist?> GetByIdAsync(Guid playlistId, CancellationToken cancellationToken = default);
}
