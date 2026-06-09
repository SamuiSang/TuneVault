using FluentValidation;
using TuneVault.Application.Features.Playlist.Commands.ShareMedia;

namespace TuneVault.Application.Features.Playlist.Commands.ShareMedia;

/// <summary>
/// Validator cho ShareMediaCommand
/// </summary>
public class ShareMediaCommandValidator : AbstractValidator<ShareMediaCommand>
{
    public ShareMediaCommandValidator()
    {
        RuleFor(x => x.MediaId)
            .NotEmpty()
            .WithMessage("Media ID không được để trống");

        RuleFor(x => x.SenderId)
            .NotEmpty()
            .WithMessage("Sender ID không được để trống")
            .MinimumLength(1)
            .WithMessage("Sender ID không hợp lệ");

        RuleFor(x => x.ReceiverId)
            .NotEmpty()
            .WithMessage("Receiver ID không được để trống")
            .MinimumLength(1)
            .WithMessage("Receiver ID không hợp lệ");

        // Người gửi và người nhận phải khác nhau
        RuleFor(x => x)
            .Must(x => x.SenderId != x.ReceiverId)
            .WithMessage("Không thể chia sẻ với chính mình");
    }
}
