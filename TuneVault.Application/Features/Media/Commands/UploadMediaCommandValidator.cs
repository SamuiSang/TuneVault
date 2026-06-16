using FluentValidation;

namespace TuneVault.Application.Features.Media.Commands;

public class UploadMediaCommandValidator : AbstractValidator<UploadMediaCommand>
{
    private static readonly string[] AllowedTypes = { "Audio", "Video", "Podcast" };

    public UploadMediaCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .Must(type => AllowedTypes.Contains(type, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Type must be Audio, Video, or Podcast.");

        RuleFor(x => x.Duration)
            .GreaterThan(0).WithMessage("Duration must be greater than zero.");

        RuleFor(x => x.OwnerId)
            .NotEmpty().WithMessage("OwnerId is required.");

        RuleFor(x => x.FileName)
            .NotEmpty().WithMessage("FileName is required.");
    }
}
