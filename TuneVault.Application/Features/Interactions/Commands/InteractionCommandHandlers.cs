using MediatR;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Interactions.Commands;

// ==================== FAVORITE COMMAND HANDLERS ====================

public class AddFavoriteCommandHandler : IRequestHandler<AddFavoriteCommand, bool>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public AddFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<bool> Handle(AddFavoriteCommand request, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.AddFavoriteAsync(request.UserId, request.MediaItemId);
    }
}

public class RemoveFavoriteCommandHandler : IRequestHandler<RemoveFavoriteCommand, bool>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public RemoveFavoriteCommandHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<bool> Handle(RemoveFavoriteCommand request, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.RemoveFavoriteAsync(request.UserId, request.MediaItemId);
    }
}

// ==================== PLAY HISTORY COMMAND HANDLERS ====================

public class CreatePlayHistoryCommandHandler : IRequestHandler<CreatePlayHistoryCommand, Guid>
{
    private readonly IPlayHistoryRepository _playHistoryRepository;

    public CreatePlayHistoryCommandHandler(IPlayHistoryRepository playHistoryRepository)
    {
        _playHistoryRepository = playHistoryRepository;
    }

    public async Task<Guid> Handle(CreatePlayHistoryCommand request, CancellationToken cancellationToken)
    {
        return await _playHistoryRepository.AddPlayHistoryAsync(request.UserId, request.MediaItemId);
    }
}

public class RemovePlayHistoryCommandHandler : IRequestHandler<RemovePlayHistoryCommand, bool>
{
    private readonly IPlayHistoryRepository _playHistoryRepository;

    public RemovePlayHistoryCommandHandler(IPlayHistoryRepository playHistoryRepository)
    {
        _playHistoryRepository = playHistoryRepository;
    }

    public async Task<bool> Handle(RemovePlayHistoryCommand request, CancellationToken cancellationToken)
    {
        return await _playHistoryRepository.RemovePlayHistoryAsync(request.PlayHistoryId);
    }
}

// ==================== FOLLOW COMMAND HANDLERS ====================

public class FollowUserCommandHandler : IRequestHandler<FollowUserCommand, Guid>
{
    private readonly IFollowRepository _followRepository;

    public FollowUserCommandHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<Guid> Handle(FollowUserCommand request, CancellationToken cancellationToken)
    {
        return await _followRepository.FollowUserAsync(request.FollowerId, request.FolloweeId);
    }
}

public class FollowArtistCommandHandler : IRequestHandler<FollowArtistCommand, Guid>
{
    private readonly IFollowRepository _followRepository;

    public FollowArtistCommandHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<Guid> Handle(FollowArtistCommand request, CancellationToken cancellationToken)
    {
        return await _followRepository.FollowArtistAsync(request.FollowerId, request.ArtistId);
    }
}

public class UnfollowUserCommandHandler : IRequestHandler<UnfollowUserCommand, bool>
{
    private readonly IFollowRepository _followRepository;

    public UnfollowUserCommandHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<bool> Handle(UnfollowUserCommand request, CancellationToken cancellationToken)
    {
        return await _followRepository.UnfollowUserAsync(request.FollowerId, request.FolloweeId);
    }
}

public class UnfollowArtistCommandHandler : IRequestHandler<UnfollowArtistCommand, bool>
{
    private readonly IFollowRepository _followRepository;

    public UnfollowArtistCommandHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<bool> Handle(UnfollowArtistCommand request, CancellationToken cancellationToken)
    {
        return await _followRepository.UnfollowArtistAsync(request.FollowerId, request.ArtistId);
    }
}
