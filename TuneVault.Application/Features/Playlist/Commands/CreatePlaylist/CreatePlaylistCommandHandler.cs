using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Features.Playlist.Commands.CreatePlaylist;

public class CreatePlaylistCommandHandler
    : IRequestHandler<CreatePlaylistCommand, Guid>
{
    private readonly IPlaylistRepository _playlistRepository;

    public CreatePlaylistCommandHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<Guid> Handle(
        CreatePlaylistCommand request,
        CancellationToken cancellationToken)
    {
        var playlist = new TuneVault.Domain.Entities.Playlist
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            IsPublic = request.IsPublic,
            OwnerId = request.OwnerId,
            CreatedAt = DateTime.UtcNow
        };

        var playlistId =
            await _playlistRepository.CreateAsync(playlist);

        return playlistId;
    }
}