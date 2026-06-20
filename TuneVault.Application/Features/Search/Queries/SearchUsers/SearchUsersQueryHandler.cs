using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchUsers;

public class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, IEnumerable<UserSearchDto>>
{
    private readonly ISearchRepository _searchRepository;

    public SearchUsersQueryHandler(ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }

    public async Task<IEnumerable<UserSearchDto>> Handle(
        SearchUsersQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Keyword))
        {
            return Enumerable.Empty<UserSearchDto>();
        }

        return await _searchRepository.SearchUsersAsync(request.Keyword);
    }
}
