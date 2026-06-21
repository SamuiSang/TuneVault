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

    public async Task<bool> UpdateProfileAsync(string userId, string? displayName, string? bio, string? avatarUrl)
{
    var sql = @"UPDATE AppUser
                SET DisplayName = @DisplayName, Bio = @Bio, AvatarUrl = @AvatarUrl
                WHERE Id = @UserId";

    var rowsAffected = await _db.ExecuteAsync(sql, new { UserId = userId, DisplayName = displayName, Bio = bio, AvatarUrl = avatarUrl });
    return rowsAffected > 0;
}
    public async Task<AppUser?> GetByIdAsync(string userId)
    {
        var sql = "SELECT * FROM AppUser WHERE Id = @UserId";
        return await _db.QuerySingleOrDefaultAsync<AppUser>(sql, new { UserId = userId });
    }
    public async Task<bool> ExistsAsync(string userId, CancellationToken cancellationToken = default)
        {
            // Kiểm tra xem Id có tồn tại trong bảng AppUser hay không
            const string sql = @"
                SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END 
                FROM AppUser 
                WHERE Id = @Id";

            var exists = await _db.ExecuteScalarAsync<bool>(new CommandDefinition(
                sql, 
                new { Id = userId }, 
                cancellationToken: cancellationToken
            ));

            return exists;
        }
    public async Task<string?> GetIdByUsernameAsync(string username, CancellationToken cancellationToken = default)
        {
        // Tìm Id của người dùng dựa trên UserName
        // (Nếu cột tên trong DB của bạn là Username, Name, hoặc Email thì sửa lại cho khớp nhé)
        const string sql = "SELECT Id FROM AppUser WHERE UserName = @UserName";

        var id = await _db.QuerySingleOrDefaultAsync<string>(new CommandDefinition(
            sql, 
            new { UserName = username }, 
        cancellationToken: cancellationToken
        ));

        return id;
    }   
}
