using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Features.Follows.FollowArtistCommand;

public class FollowArtistCommandHandler
: IRequestHandler<FollowArtistCommand, Guid>
{
private readonly IFollowRepository _followRepository;
private readonly INotificationService _notificationService;

public FollowArtistCommandHandler(
    IFollowRepository followRepository,
    INotificationService notificationService)
{
    _followRepository = followRepository;
    _notificationService = notificationService;
}

public async Task<Guid> Handle(
    FollowArtistCommand request,
    CancellationToken cancellationToken)
{
    var exists = await _followRepository.ExistsAsync(
        request.FollowerId,
        request.FolloweeId);

    if (exists)
        throw new Exception("Already followed.");

    var follow = new Follow
    {
        Id = Guid.NewGuid(),
        FollowerId = request.FollowerId,
        FolloweeId = request.FolloweeId,
        CreatedAt = DateTime.UtcNow
    };

    await _followRepository.CreateAsync(follow);

    await _notificationService.CreateNotificationAsync(
        request.FolloweeId,
        "Follow",
        "Someone started following you");

    return follow.Id;
}

}
