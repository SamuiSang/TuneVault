using FluentValidation;

namespace TuneVault.Application.Features.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        // Đổi v.Email thành v.EmailOrUsername
        RuleFor(v => v.EmailOrUsername)
            .NotEmpty().WithMessage("Tên đăng nhập hoặc email không được để trống.");

        RuleFor(v => v.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống.");
    }
}