using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetPlaylistDetail;

public class GetPlaylistDetailQueryHandler
    : IRequestHandler<GetPlaylistDetailQuery, PlaylistDetailDto?>
{
    private readonly IPlaylistRepository _playlistRepository;
    private readonly IMediaShareRepository _mediaShareRepository;

    public GetPlaylistDetailQueryHandler(
        IPlaylistRepository playlistRepository,
        IMediaShareRepository mediaShareRepository)
    {
        _playlistRepository = playlistRepository;
        _mediaShareRepository = mediaShareRepository;
    }

    public async Task<PlaylistDetailDto?> Handle(
        GetPlaylistDetailQuery request,
        CancellationToken cancellationToken)
    {
        var playlist = await _playlistRepository.GetPlaylistDetailAsync(request.PlaylistId);
        if (playlist == null) return null;

        // Nếu playlist không public, thì phải là chủ sở hữu HOẶC được chia sẻ
        if (!playlist.IsPublic)
        {
            if (string.IsNullOrEmpty(request.UserId))
                throw new UnauthorizedAccessException("Bạn không có quyền xem playlist này.");

            if (playlist.OwnerId != request.UserId)
            {
                bool isShared = await _mediaShareRepository.IsPlaylistSharedWithUserAsync(request.PlaylistId, request.UserId, cancellationToken);
                if (!isShared)
                {
                    throw new UnauthorizedAccessException("Playlist này là riêng tư và chưa được chia sẻ cho bạn.");
                }
            }
        }

        return playlist;
    }
}