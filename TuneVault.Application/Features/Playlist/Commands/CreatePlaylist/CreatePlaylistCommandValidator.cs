using FluentValidation;

namespace TuneVault.Application.Features.Playlist.Commands.CreatePlaylist;

public class CreatePlaylistCommandValidator
    : AbstractValidator<CreatePlaylistCommand>
{
    public CreatePlaylistCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Playlist name is required.")
            .MaximumLength(100)
            .WithMessage("Playlist name must not exceed 100 characters.");

        RuleFor(x => x.OwnerId)
            .NotEmpty()
            .WithMessage("OwnerId is required.");
    }
}