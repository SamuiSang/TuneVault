using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchPlaylists;

public class SearchPlaylistsQueryHandler
    : IRequestHandler<SearchPlaylistsQuery, IEnumerable<PlaylistSearchDto>>
{
    private readonly ISearchRepository _searchRepository;

    public SearchPlaylistsQueryHandler(
        ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<IEnumerable<PlaylistSearchDto>> Handle(
        SearchPlaylistsQuery request,
        CancellationToken cancellationToken)
    {
        return await _searchRepository.SearchPlaylistsAsync(
            request.Keyword);
    }
}