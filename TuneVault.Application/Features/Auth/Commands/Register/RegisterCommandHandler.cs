// RegisterCommandHandler.cs mẫu
using Microsoft.AspNetCore.Identity;
using MediatR; // Dành cho IRequestHandler
using TuneVault.Application.Common.Models;

using TuneVault.Domain.Entities.Users;
using TuneVault.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, BaseResponse<string>>
{
    private readonly UserManager<AppUser> _userManager;

    public RegisterCommandHandler(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<BaseResponse<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // 1. Kiểm tra trùng lặp email
        var userExists = await _userManager.FindByEmailAsync(request.Email);
        if (userExists != null) return new BaseResponse<string>("Email này đã được sử dụng.");

        // 2. Khởi tạo đối tượng AppUser
        var user = new AppUser
        {
            UserName = request.UserName,
            Email = request.Email
        };

        // 3. Lưu vào hệ thống via Identity (tự động băm mật khẩu)
        var result = await _userManager.CreateAsync(user, request.Password);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new BaseResponse<string>($"Đăng ký thất bại: {errors}");
        }

        return new BaseResponse<string>(string.Empty, true, "Đăng ký tài khoản thành công!");
    }
}