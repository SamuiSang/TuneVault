using MediatR;
using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Application.Features.Albums.Queries.GetAlbumById;

public class GetAlbumByIdQuery : IRequest<AlbumDetailDto?>
{
    public GetAlbumByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}
