namespace TuneVault.Application.Common.Interfaces;

using TuneVault.Domain.Entities.Users;

public interface IUserRepository
{
    Task<bool> UpdateProfileAsync(string userId, string? bio, string? avatarUrl);
    Task<AppUser?> GetByIdAsync(string userId);
    Task<bool> ExistsAsync(string userId, CancellationToken cancellationToken = default);
    Task<string?> GetIdByUsernameAsync(string username, CancellationToken cancellationToken = default);
}