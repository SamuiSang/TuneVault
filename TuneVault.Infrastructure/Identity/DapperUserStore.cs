using System.Data;
using Dapper;
using Microsoft.AspNetCore.Identity;
using TuneVault.Domain.Entities.Users;

namespace TuneVault.Infrastructure.Identity;

public class DapperUserStore : IUserStore<AppUser>, IUserPasswordStore<AppUser>, IUserEmailStore<AppUser>
{
    private readonly IDbConnection _db;

    public DapperUserStore(IDbConnection db)
    {
        _db = db;
    }

    #region IUserStore (Các hàm thao tác chung)

    public async Task<IdentityResult> CreateAsync(AppUser user, CancellationToken cancellationToken)
    {
        user.Id = Guid.NewGuid().ToString();
        // Không chèn NormalizedUserName và NormalizedEmail vào SQL nữa
        var sql = @"INSERT INTO AppUser (Id, UserName, Email, PasswordHash) 
                    VALUES (@Id, @UserName, @Email, @PasswordHash)";

        await _db.ExecuteAsync(sql, user);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(AppUser user, CancellationToken cancellationToken)
    {
        var sql = @"UPDATE AppUser SET 
                    UserName = @UserName, Email = @Email, PasswordHash = @PasswordHash 
                    WHERE Id = @Id";
        await _db.ExecuteAsync(sql, user);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(AppUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var sql = "DELETE FROM AppUsers WHERE Id = @Id";
        await _db.ExecuteAsync(sql, new { Id = user.Id });
        return IdentityResult.Success;
    }

    public async Task<AppUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var sql = "SELECT * FROM AppUsers WHERE Id = @Id";
        return await _db.QuerySingleOrDefaultAsync<AppUser>(sql, new { Id = userId });
    }

    public async Task<AppUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        // Identity truyền vào tên đã in hoa, nên mình ép cột UserName in hoa lên để đọ sức
        var sql = "SELECT * FROM AppUser WHERE UPPER(UserName) = @NormalizedUserName";
        return await _db.QuerySingleOrDefaultAsync<AppUser>(sql, new { NormalizedUserName = normalizedUserName });
    }

    public Task<string> GetUserIdAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Id);
    }

    public Task<string?> GetUserNameAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task SetUserNameAsync(AppUser user, string? userName, CancellationToken cancellationToken)
    {
        user.UserName = userName;
        return Task.CompletedTask;
    }

    public Task<string?> GetNormalizedUserNameAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedUserName);
    }

    public Task SetNormalizedUserNameAsync(AppUser user, string? normalizedName, CancellationToken cancellationToken)
    {
        user.NormalizedUserName = normalizedName;
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        // Không cần giải phóng kết nối vì DI container sẽ tự lo
    }

    #endregion

    #region IUserEmailStore (Các hàm xử lý Email)

    public Task SetEmailAsync(AppUser user, string? email, CancellationToken cancellationToken)
    {
        user.Email = email;
        return Task.CompletedTask;
    }

    public Task<string?> GetEmailAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Email);
    }

    public Task<bool> GetEmailConfirmedAsync(AppUser user, CancellationToken cancellationToken)
    {
        // Hiện tại cứ mặc định là chưa xác thực email (false)
        return Task.FromResult(false);
    }

    public Task SetEmailConfirmedAsync(AppUser user, bool confirmed, CancellationToken cancellationToken)
    {
        // Nếu sau này bạn có cột EmailConfirmed trong DB thì gán vào đây
        return Task.CompletedTask;
    }

    public async Task<AppUser?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        var sql = "SELECT * FROM AppUser WHERE UPPER(Email) = @NormalizedEmail";
        return await _db.QuerySingleOrDefaultAsync<AppUser>(sql, new { NormalizedEmail = normalizedEmail });
    }

    public Task<string?> GetNormalizedEmailAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedEmail);
    }

    public Task SetNormalizedEmailAsync(AppUser user, string? normalizedEmail, CancellationToken cancellationToken)
    {
        user.NormalizedEmail = normalizedEmail;
        return Task.CompletedTask;
    }

    #endregion

    #region IUserPasswordStore (Các hàm xử lý Mật khẩu)

    public Task SetPasswordHashAsync(AppUser user, string? passwordHash, CancellationToken cancellationToken)
    {
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }

    public Task<string?> GetPasswordHashAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.PasswordHash);
    }

    public Task<bool> HasPasswordAsync(AppUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
    }

    #endregion
}