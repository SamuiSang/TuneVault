using MediatR;
using TuneVault.Application.Features.Interactions.DTOs;

namespace TuneVault.Application.Features.Interactions.Queries;

// ==================== FAVORITE QUERIES ====================

public class IsFavoriteQuery : IRequest<bool>
{
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
}

public class GetUserFavoritesQuery : IRequest<IEnumerable<FavoriteMediaDto>>
{
    public required string UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserFavoritesCountQuery : IRequest<int>
{
    public required string UserId { get; set; }
}

// ==================== PLAY HISTORY QUERIES ====================

public class GetUserPlayHistoryQuery : IRequest<IEnumerable<PlayHistoryDetailDto>>
{
    public required string UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetTopPlayedMediaQuery : IRequest<IEnumerable<TopPlayedMediaDto>>
{
    public required string UserId { get; set; }
    public int Limit { get; set; } = 10;
}

public class GetPlayHistoryCountQuery : IRequest<int>
{
    public required string UserId { get; set; }
}

// ==================== FOLLOW QUERIES ====================

public class IsFollowingUserQuery : IRequest<bool>
{
    public required string FollowerId { get; set; }
    public required string FolloweeId { get; set; }
}

public class IsFollowingArtistQuery : IRequest<bool>
{
    public required string FollowerId { get; set; }
    public required Guid ArtistId { get; set; }
}

public class GetFollowingUsersQuery : IRequest<IEnumerable<FollowingUserDto>>
{
    public required string FollowerId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetFollowingArtistsQuery : IRequest<IEnumerable<FollowingArtistDto>>
{
    public required string FollowerId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserFollowersQuery : IRequest<IEnumerable<FollowerUserDto>>
{
    public required string FolloweeId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetArtistFollowersQuery : IRequest<IEnumerable<FollowerUserDto>>
{
    public required Guid ArtistId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserFollowerCountQuery : IRequest<int>
{
    public required string FolloweeId { get; set; }
}

public class GetArtistFollowerCountQuery : IRequest<int>
{
    public required Guid ArtistId { get; set; }
}

public class GetFollowStatsQuery : IRequest<FollowStatsDto>
{
    public required string UserId { get; set; }
}
