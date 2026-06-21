using MediatR;
using Microsoft.AspNetCore.Identity;
using TuneVault.Application.Common.Models;
using TuneVault.Domain.Entities.Users;

namespace TuneVault.Application.Features.Auth.Commands.VerifyArtist;

// Dữ liệu gửi lên
public record VerifyArtistCommand(string UserId, string Password) : IRequest<BaseResponse<string>>;

// Xử lý logic
public class VerifyArtistCommandHandler : IRequestHandler<VerifyArtistCommand, BaseResponse<string>>
{
    private readonly UserManager<AppUser> _userManager;

    public VerifyArtistCommandHandler(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<BaseResponse<string>> Handle(VerifyArtistCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null) return new BaseResponse<string>("Không tìm thấy người dùng.");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid) return new BaseResponse<string>("Mật khẩu không chính xác.");

        user.IsArtist = true;
        await _userManager.UpdateAsync(user);

        return new BaseResponse<string>(string.Empty, true, "Bạn đã được cấp quyền Nghệ sĩ!");
    }
}