using MediatR;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchUsers;

public record SearchUsersQuery(string Keyword) : IRequest<IEnumerable<UserSearchDto>>;
