using MediatR;
using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Application.Features.Albums.Queries.GetAlbumsByArtistId;

public class GetAlbumsByArtistIdQuery : IRequest<IEnumerable<AlbumDto>>
{
    public GetAlbumsByArtistIdQuery(string artistId)
    {
        ArtistId = artistId;
    }

    public string ArtistId { get; set; }
}
