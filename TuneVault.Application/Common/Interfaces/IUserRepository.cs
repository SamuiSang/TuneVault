namespace TuneVault.Application.Common.Interfaces;

public interface IUserRepository
{
    Task<bool> UpdateProfileAsync(string userId, string? bio, string? avatarUrl);
}