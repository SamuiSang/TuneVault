namespace TuneVault.Application.Common.Interfaces;

// Thay thế bằng namespace chính xác trỏ tới thư mục chứa AppUser của bạn
using TuneVault.Domain.Entities.Users; 

public interface ITokenService
{
    string GenerateToken(AppUser user);
}