using TuneVault.Application.Features.Interactions.DTOs;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Common.Interfaces;

public interface IFollowRepository
{
    // Commands - Follow User
    Task<Guid> FollowUserAsync(string followerId, string followeeId);

    // Commands - Follow Artist
    Task<Guid> FollowArtistAsync(string followerId, string artistId);

    // Commands - Unfollow
    Task<bool> UnfollowUserAsync(string followerId, string followeeId);
    Task<bool> UnfollowArtistAsync(string followerId, string artistId);

    // Queries - Check Following
    Task<bool> IsFollowingUserAsync(string followerId, string followeeId);
    Task<bool> IsFollowingArtistAsync(string followerId, string artistId);

    // Queries - Get Following
    Task<IEnumerable<FollowingUserDto>> GetFollowingUsersAsync(string followerId, int pageNumber = 1, int pageSize = 10);
    Task<IEnumerable<FollowingArtistDto>> GetFollowingArtistsAsync(string followerId, int pageNumber = 1, int pageSize = 10);

    // Queries - Get Followers
    Task<IEnumerable<FollowerUserDto>> GetUserFollowersAsync(string followeeId, int pageNumber = 1, int pageSize = 10);
    Task<IEnumerable<FollowerUserDto>> GetArtistFollowersAsync(string artistId, int pageNumber = 1, int pageSize = 10);

    // Queries - Statistics
    Task<int> GetUserFollowerCountAsync(string followeeId);
    Task<int> GetArtistFollowerCountAsync(string artistId);
    Task<FollowStatsDto> GetFollowStatsAsync(string userId);
    Task<bool> ExistsAsync(string followerId, string followeeId);
    Task<object> CreateAsync(Follow follow);
}
