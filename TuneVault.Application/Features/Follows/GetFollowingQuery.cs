using MediatR;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Features.Follows.GetFollowingQuery;

public record GetFollowingQuery(
string UserId
) : IRequest<List<FollowDto>>;
