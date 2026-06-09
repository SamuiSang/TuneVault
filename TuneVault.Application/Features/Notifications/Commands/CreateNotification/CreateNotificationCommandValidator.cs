using FluentValidation;
using TuneVault.Application.Features.Notifications.Commands.CreateNotification;

namespace TuneVault.Application.Features.Notifications.Commands;

/// <summary>
/// Validator cho CreateNotificationCommand
/// Đảm bảo dữ liệu hợp lệ trước khi lưu vào DB
/// </summary>
public class CreateNotificationCommandValidator : AbstractValidator<CreateNotificationCommand>
{
    public CreateNotificationCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId không được để trống!")
            .NotNull().WithMessage("UserId không được null!");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type không được để trống!")
            .NotNull().WithMessage("Type không được null!")
            .MinimumLength(2).WithMessage("Type phải có ít nhất 2 ký tự")
            .MaximumLength(50).WithMessage("Type không được vượt quá 50 ký tự");

        RuleFor(x => x.PayloadJson)
            .NotEmpty().WithMessage("PayloadJson không được để trống!")
            .NotNull().WithMessage("PayloadJson không được null!")
            .Must(IsValidJson).WithMessage("PayloadJson phải là JSON hợp lệ");
    }

    /// <summary>
    /// Kiểm tra xem chuỗi có phải là JSON hợp lệ hay không
    /// </summary>
    private static bool IsValidJson(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return false;

        try
        {
            System.Text.Json.JsonDocument.Parse(json);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
