using MediatR;

namespace TuneVault.Application.Features.Follows.FollowArtistCommand;

public record FollowArtistCommand(
string FollowerId,
string FolloweeId
) : IRequest<Guid>;
