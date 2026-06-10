using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Common.Interfaces;

public interface IFavoriteRepository
{
    // Commands
    Task<bool> AddFavoriteAsync(string userId, Guid mediaItemId);
    Task<bool> RemoveFavoriteAsync(string userId, Guid mediaItemId);

    // Queries
    Task<bool> IsFavoriteAsync(string userId, Guid mediaItemId);
    Task<IEnumerable<FavoriteMediaDto>> GetUserFavoritesAsync(string userId, int pageNumber = 1, int pageSize = 10);
    Task<int> GetUserFavoritesCountAsync(string userId);
}
