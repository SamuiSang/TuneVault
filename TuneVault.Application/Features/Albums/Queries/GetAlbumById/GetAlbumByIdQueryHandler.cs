using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Application.Features.Albums.Queries.GetAlbumById;

public class GetAlbumByIdQueryHandler : IRequestHandler<GetAlbumByIdQuery, AlbumDetailDto?>
{
    private readonly IAlbumRepository _albumRepository;

    public GetAlbumByIdQueryHandler(IAlbumRepository albumRepository)
    {
        _albumRepository = albumRepository;
    }

    public async Task<AlbumDetailDto?> Handle(GetAlbumByIdQuery request, CancellationToken cancellationToken)
    {
        return await _albumRepository.GetAlbumByIdAsync(request.Id);
    }
}
