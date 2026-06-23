using MediatR;

namespace TuneVault.Application.Features.Interactions.Commands;

// ==================== FAVORITE COMMANDS ====================

public class AddFavoriteCommand : IRequest<bool>
{
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
}

public class RemoveFavoriteCommand : IRequest<bool>
{
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
}

// ==================== PLAY HISTORY COMMANDS ====================

public class CreatePlayHistoryCommand : IRequest<Guid>
{
    public required string UserId { get; set; }
    public required Guid MediaItemId { get; set; }
}

public class RemovePlayHistoryCommand : IRequest<bool>
{
    public required Guid PlayHistoryId { get; set; }
}

// ==================== FOLLOW COMMANDS ====================

public class FollowUserCommand : IRequest<Guid>
{
    public required string FollowerId { get; set; }
    public required string FolloweeId { get; set; }
}

public class FollowArtistCommand : IRequest<Guid>
{
    public required string FollowerId { get; set; }
    public required string ArtistId { get; set; }
}

public class UnfollowUserCommand : IRequest<bool>
{
    public required string FollowerId { get; set; }
    public required string FolloweeId { get; set; }
}

public class UnfollowArtistCommand : IRequest<bool>
{
    public required string FollowerId { get; set; }
    public required string ArtistId { get; set; }
}
