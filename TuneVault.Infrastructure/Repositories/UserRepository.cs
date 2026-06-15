using System.Data;
using Dapper;
using TuneVault.Application.Common.Interfaces;

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
        // ⚠️ LƯU Ý: Hãy đổi chữ 'Users' thành đúng tên bảng lưu Người dùng của bạn (VD: AppUsers, NguoiDung...)
        var sql = @"UPDATE Users 
                    SET Bio = @Bio, AvatarUrl = @AvatarUrl 
                    WHERE Id = @UserId";

        // Thực thi câu lệnh SQL, Dapper trả về số dòng bị ảnh hưởng
        var rowsAffected = await _db.ExecuteAsync(sql, new { UserId = userId, Bio = bio, AvatarUrl = avatarUrl });
        
        return rowsAffected > 0; // Trả về true nếu cập nhật thành công ít nhất 1 dòng
    }
}