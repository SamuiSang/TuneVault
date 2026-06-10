using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Features.Interactions.Queries;

// ==================== FAVORITE QUERY HANDLERS ====================

public class IsFavoriteQueryHandler : IRequestHandler<IsFavoriteQuery, bool>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public IsFavoriteQueryHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<bool> Handle(IsFavoriteQuery request, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.IsFavoriteAsync(request.UserId, request.MediaItemId);
    }
}

public class GetUserFavoritesQueryHandler : IRequestHandler<GetUserFavoritesQuery, IEnumerable<FavoriteMediaDto>>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public GetUserFavoritesQueryHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<IEnumerable<FavoriteMediaDto>> Handle(GetUserFavoritesQuery request, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.GetUserFavoritesAsync(request.UserId, request.PageNumber, request.PageSize);
    }
}

public class GetUserFavoritesCountQueryHandler : IRequestHandler<GetUserFavoritesCountQuery, int>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public GetUserFavoritesCountQueryHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<int> Handle(GetUserFavoritesCountQuery request, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.GetUserFavoritesCountAsync(request.UserId);
    }
}

// ==================== PLAY HISTORY QUERY HANDLERS ====================

public class GetUserPlayHistoryQueryHandler : IRequestHandler<GetUserPlayHistoryQuery, IEnumerable<PlayHistoryDetailDto>>
{
    private readonly IPlayHistoryRepository _playHistoryRepository;

    public GetUserPlayHistoryQueryHandler(IPlayHistoryRepository playHistoryRepository)
    {
        _playHistoryRepository = playHistoryRepository;
    }

    public async Task<IEnumerable<PlayHistoryDetailDto>> Handle(GetUserPlayHistoryQuery request, CancellationToken cancellationToken)
    {
        return await _playHistoryRepository.GetUserPlayHistoryAsync(request.UserId, request.PageNumber, request.PageSize);
    }
}

public class GetTopPlayedMediaQueryHandler : IRequestHandler<GetTopPlayedMediaQuery, IEnumerable<TopPlayedMediaDto>>
{
    private readonly IPlayHistoryRepository _playHistoryRepository;

    public GetTopPlayedMediaQueryHandler(IPlayHistoryRepository playHistoryRepository)
    {
        _playHistoryRepository = playHistoryRepository;
    }

    public async Task<IEnumerable<TopPlayedMediaDto>> Handle(GetTopPlayedMediaQuery request, CancellationToken cancellationToken)
    {
        return await _playHistoryRepository.GetTopPlayedMediaAsync(request.UserId, request.Limit);
    }
}

public class GetPlayHistoryCountQueryHandler : IRequestHandler<GetPlayHistoryCountQuery, int>
{
    private readonly IPlayHistoryRepository _playHistoryRepository;

    public GetPlayHistoryCountQueryHandler(IPlayHistoryRepository playHistoryRepository)
    {
        _playHistoryRepository = playHistoryRepository;
    }

    public async Task<int> Handle(GetPlayHistoryCountQuery request, CancellationToken cancellationToken)
    {
        return await _playHistoryRepository.GetPlayHistoryCountAsync(request.UserId);
    }
}

// ==================== FOLLOW QUERY HANDLERS ====================

public class IsFollowingUserQueryHandler : IRequestHandler<IsFollowingUserQuery, bool>
{
    private readonly IFollowRepository _followRepository;

    public IsFollowingUserQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<bool> Handle(IsFollowingUserQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.IsFollowingUserAsync(request.FollowerId, request.FolloweeId);
    }
}

public class IsFollowingArtistQueryHandler : IRequestHandler<IsFollowingArtistQuery, bool>
{
    private readonly IFollowRepository _followRepository;

    public IsFollowingArtistQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<bool> Handle(IsFollowingArtistQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.IsFollowingArtistAsync(request.FollowerId, request.ArtistId);
    }
}

public class GetFollowingUsersQueryHandler : IRequestHandler<GetFollowingUsersQuery, IEnumerable<FollowingUserDto>>
{
    private readonly IFollowRepository _followRepository;

    public GetFollowingUsersQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<IEnumerable<FollowingUserDto>> Handle(GetFollowingUsersQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetFollowingUsersAsync(request.FollowerId, request.PageNumber, request.PageSize);
    }
}

public class GetFollowingArtistsQueryHandler : IRequestHandler<GetFollowingArtistsQuery, IEnumerable<FollowingArtistDto>>
{
    private readonly IFollowRepository _followRepository;

    public GetFollowingArtistsQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<IEnumerable<FollowingArtistDto>> Handle(GetFollowingArtistsQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetFollowingArtistsAsync(request.FollowerId, request.PageNumber, request.PageSize);
    }
}

public class GetUserFollowersQueryHandler : IRequestHandler<GetUserFollowersQuery, IEnumerable<FollowerUserDto>>
{
    private readonly IFollowRepository _followRepository;

    public GetUserFollowersQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<IEnumerable<FollowerUserDto>> Handle(GetUserFollowersQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetUserFollowersAsync(request.FolloweeId, request.PageNumber, request.PageSize);
    }
}

public class GetArtistFollowersQueryHandler : IRequestHandler<GetArtistFollowersQuery, IEnumerable<FollowerUserDto>>
{
    private readonly IFollowRepository _followRepository;

    public GetArtistFollowersQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<IEnumerable<FollowerUserDto>> Handle(GetArtistFollowersQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetArtistFollowersAsync(request.ArtistId, request.PageNumber, request.PageSize);
    }
}

public class GetUserFollowerCountQueryHandler : IRequestHandler<GetUserFollowerCountQuery, int>
{
    private readonly IFollowRepository _followRepository;

    public GetUserFollowerCountQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<int> Handle(GetUserFollowerCountQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetUserFollowerCountAsync(request.FolloweeId);
    }
}

public class GetArtistFollowerCountQueryHandler : IRequestHandler<GetArtistFollowerCountQuery, int>
{
    private readonly IFollowRepository _followRepository;

    public GetArtistFollowerCountQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<int> Handle(GetArtistFollowerCountQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetArtistFollowerCountAsync(request.ArtistId);
    }
}

public class GetFollowStatsQueryHandler : IRequestHandler<GetFollowStatsQuery, FollowStatsDto>
{
    private readonly IFollowRepository _followRepository;

    public GetFollowStatsQueryHandler(IFollowRepository followRepository)
    {
        _followRepository = followRepository;
    }

    public async Task<FollowStatsDto> Handle(GetFollowStatsQuery request, CancellationToken cancellationToken)
    {
        return await _followRepository.GetFollowStatsAsync(request.UserId);
    }
}
