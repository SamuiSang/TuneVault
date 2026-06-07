using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchMedia;

public class SearchMediaQueryHandler
    : IRequestHandler<SearchMediaQuery, IEnumerable<TrackDto>>
{
    private readonly ISearchRepository _searchRepository;

    public SearchMediaQueryHandler(
        ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<IEnumerable<TrackDto>> Handle(
        SearchMediaQuery request,
        CancellationToken cancellationToken)
    {
        return await _searchRepository.SearchMediaAsync(
            request.Keyword);
    }
}