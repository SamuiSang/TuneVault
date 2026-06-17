using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Domain.Entities.Users;

namespace TuneVault.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnection _db;

    public UserRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<bool> UpdateProfileAsync(string userId, string? bio, string? avatarUrl)
    {
        var sql = @"UPDATE AppUser
                    SET Bio = @Bio, AvatarUrl = @AvatarUrl
                    WHERE Id = @UserId";

        var rowsAffected = await _db.ExecuteAsync(sql, new { UserId = userId, Bio = bio, AvatarUrl = avatarUrl });
        return rowsAffected > 0;
    }

    public async Task<AppUser?> GetByIdAsync(string userId)
    {
        var sql = "SELECT * FROM AppUser WHERE Id = @UserId";
        return await _db.QuerySingleOrDefaultAsync<AppUser>(sql, new { UserId = userId });
    }
}
