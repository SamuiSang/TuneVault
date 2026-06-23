using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Application.Features.Albums.Queries.GetAlbumsByArtistId;

public class GetAlbumsByArtistIdQueryHandler : IRequestHandler<GetAlbumsByArtistIdQuery, IEnumerable<AlbumDto>>
{
    private readonly IAlbumRepository _albumRepository;

    public GetAlbumsByArtistIdQueryHandler(IAlbumRepository albumRepository)
    {
        _albumRepository = albumRepository;
    }

    public async Task<IEnumerable<AlbumDto>> Handle(GetAlbumsByArtistIdQuery request, CancellationToken cancellationToken)
    {
        return await _albumRepository.GetAlbumsByArtistIdAsync(request.ArtistId);
    }
}
