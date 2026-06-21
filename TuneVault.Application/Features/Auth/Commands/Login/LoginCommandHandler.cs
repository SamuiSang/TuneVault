using MediatR;
using Microsoft.AspNetCore.Identity;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Models;
using TuneVault.Domain.Entities.Users;

namespace TuneVault.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, BaseResponse<string>>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(UserManager<AppUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<BaseResponse<string>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // 1. Tìm user theo Email, nếu không có thì tìm theo UserName
        var user = await _userManager.FindByEmailAsync(request.EmailOrUsername) 
                   ?? await _userManager.FindByNameAsync(request.EmailOrUsername);
                   
        if (user == null)
        {
            return new BaseResponse<string>("Tên đăng nhập/Email hoặc mật khẩu không chính xác."); 
        }

        // 2. Kiểm tra tính hợp lệ của mật khẩu
        var result = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!result)
        {
            return new BaseResponse<string>("Tên đăng nhập/Email hoặc mật khẩu không chính xác.");
        }

        // 3. Kích hoạt dịch vụ tạo Token
        var token = _tokenService.GenerateToken(user);

        // 4. Trả kết quả
        return new BaseResponse<string>(token, true, "Đăng nhập thành công!");
    }
}