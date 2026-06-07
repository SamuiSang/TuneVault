using FluentValidation;

namespace TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;

public class AddTrackToPlaylistCommandValidator
    : AbstractValidator<AddTrackToPlaylistCommand>
{
    public AddTrackToPlaylistCommandValidator()
    {
        RuleFor(x => x.PlaylistId)
            .NotEmpty()
            .WithMessage("PlaylistId is required.");

        RuleFor(x => x.MediaItemId)
            .NotEmpty()
            .WithMessage("MediaItemId is required.");
    }
}