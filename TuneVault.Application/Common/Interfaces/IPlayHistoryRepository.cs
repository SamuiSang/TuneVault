using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Common.Interfaces;

public interface IPlayHistoryRepository
{
    // Commands
    Task<Guid> AddPlayHistoryAsync(string userId, Guid mediaItemId);
    Task<bool> RemovePlayHistoryAsync(Guid playHistoryId);

    // Queries
    Task<IEnumerable<PlayHistoryDetailDto>> GetUserPlayHistoryAsync(string userId, int pageNumber = 1, int pageSize = 10);
    Task<IEnumerable<TopPlayedMediaDto>> GetTopPlayedMediaAsync(string userId, int limit = 10);
    Task<int> GetPlayHistoryCountAsync(string userId);
}
