using MediatR;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchArtists;

public class SearchArtistsQuery : IRequest<IEnumerable<ArtistDto>>
{
    public SearchArtistsQuery(string? keyword)
    {
        Keyword = keyword ?? string.Empty;
    }

    public string Keyword { get; set; } = string.Empty;
}