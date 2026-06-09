using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetPlaylistDetail;

public class GetPlaylistDetailQueryHandler
    : IRequestHandler<GetPlaylistDetailQuery, PlaylistDetailDto?>
{
    private readonly IPlaylistRepository _playlistRepository;

    public GetPlaylistDetailQueryHandler(
        IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    public async Task<PlaylistDetailDto?> Handle(
        GetPlaylistDetailQuery request,
        CancellationToken cancellationToken)
    {
        return await _playlistRepository
            .GetPlaylistDetailAsync(request.PlaylistId);
    }
}