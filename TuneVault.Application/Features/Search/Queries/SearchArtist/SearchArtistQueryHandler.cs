using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchArtists;

public class SearchArtistsQueryHandler
    : IRequestHandler<SearchArtistsQuery, IEnumerable<ArtistDto>>
{
    private readonly ISearchRepository _searchRepository;

    public SearchArtistsQueryHandler(
        ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<IEnumerable<ArtistDto>> Handle(
        SearchArtistsQuery request,
        CancellationToken cancellationToken)
    {
        return await _searchRepository.SearchArtistsAsync(
            request.Keyword);
    }
}