using MediatR;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Features.Follows.GetFollowersQuery;

public record GetFollowersQuery(
    string UserId
) : IRequest<List<FollowDto>>;