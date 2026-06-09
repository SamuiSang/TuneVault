using FluentValidation;

namespace TuneVault.Application.Features.Playlist.Commands.UpdatePlaylist;

public class UpdatePlaylistCommandValidator
    : AbstractValidator<UpdatePlaylistCommand>
{
    public UpdatePlaylistCommandValidator()
    {
        RuleFor(x => x.PlaylistId)
            .NotEmpty()
            .WithMessage("PlaylistId is required.");

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