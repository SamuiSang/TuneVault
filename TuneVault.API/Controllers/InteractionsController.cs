using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Interactions.Commands;
using TuneVault.Application.Features.Interactions.Queries;

namespace TuneVault.API.Controllers;

/// <summary>
/// REST API cho tương tác & lịch sử (Favorite, PlayHistory, Follow)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InteractionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<InteractionsController> _logger;

    public InteractionsController(IMediator mediator, ILogger<InteractionsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    #region ==================== FAVORITE ====================

    /// <summary>
    /// Thêm media vào danh sách yêu thích
    /// </summary>
    [HttpPost("favorites/add")]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteCommand command)
    {
        try
        {
            _logger.LogInformation("User {UserId} added media {MediaItemId} to favorites", command.UserId, command.MediaItemId);

            var result = await _mediator.Send(command);

            if (!result)
            {
                return BadRequest(new BaseResponse<object> { Success = false, Message = "Failed to add favorite" });
            }

            return Ok(new BaseResponse<object> { Success = true, Message = "Favorite added successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding favorite");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Xóa media khỏi danh sách yêu thích
    /// </summary>
    [HttpPost("favorites/remove")]
    public async Task<IActionResult> RemoveFavorite([FromBody] RemoveFavoriteCommand command)
    {
        try
        {
            _logger.LogInformation("User {UserId} removed media {MediaItemId} from favorites", command.UserId, command.MediaItemId);

            var result = await _mediator.Send(command);

            if (!result)
            {
                return BadRequest(new BaseResponse<object> { Success = false, Message = "Failed to remove favorite" });
            }

            return Ok(new BaseResponse<object> { Success = true, Message = "Favorite removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing favorite");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Kiểm tra media có trong yêu thích không
    /// </summary>
    [HttpGet("favorites/check/{userId}/{mediaItemId}")]
    public async Task<IActionResult> IsFavorite(string userId, Guid mediaItemId)
    {
        try
        {
            var result = await _mediator.Send(new IsFavoriteQuery { UserId = userId, MediaItemId = mediaItemId });
            return Ok(new { isFavorite = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking favorite");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách yêu thích của user
    /// </summary>
    [HttpGet("favorites/{userId}")]
    public async Task<IActionResult> GetUserFavorites(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetUserFavoritesQuery 
            { 
                UserId = userId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user favorites");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Đếm số lượng yêu thích của user
    /// </summary>
    [HttpGet("favorites/count/{userId}")]
    public async Task<IActionResult> GetFavoritesCount(string userId)
    {
        try
        {
            var count = await _mediator.Send(new GetUserFavoritesCountQuery { UserId = userId });
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting favorites count");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    #endregion

    #region ==================== PLAY HISTORY ====================

    /// <summary>
    /// Thêm media vào lịch sử phát nhạc
    /// </summary>
    [HttpPost("history/add")]
    public async Task<IActionResult> AddPlayHistory([FromBody] CreatePlayHistoryCommand command)
    {
        try
        {
            _logger.LogInformation("User {UserId} played media {MediaItemId}", command.UserId, command.MediaItemId);

            var result = await _mediator.Send(command);

            return Ok(new { success = true, playHistoryId = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding play history");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Xóa bản ghi lịch sử phát nhạc
    /// </summary>
    [HttpPost("history/remove")]
    public async Task<IActionResult> RemovePlayHistory([FromBody] RemovePlayHistoryCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);

            if (!result)
            {
                return BadRequest(new BaseResponse<object> { Success = false, Message = "Failed to remove play history" });
            }

            return Ok(new BaseResponse<object> { Success = true, Message = "Play history removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing play history");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy lịch sử phát nhạc của user
    /// </summary>
    [HttpGet("history/{userId}")]
    public async Task<IActionResult> GetPlayHistory(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetUserPlayHistoryQuery 
            { 
                UserId = userId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting play history");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách top media được phát nhiều nhất
    /// </summary>
    [HttpGet("history/top/{userId}")]
    public async Task<IActionResult> GetTopPlayedMedia(string userId, [FromQuery] int limit = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetTopPlayedMediaQuery { UserId = userId, Limit = limit });
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting top played media");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Đếm số bản ghi lịch sử phát nhạc
    /// </summary>
    [HttpGet("history/count/{userId}")]
    public async Task<IActionResult> GetPlayHistoryCount(string userId)
    {
        try
        {
            var count = await _mediator.Send(new GetPlayHistoryCountQuery { UserId = userId });
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting play history count");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    #endregion

    #region ==================== FOLLOW USERS ====================

    /// <summary>
    /// Theo dõi một user khác
    /// </summary>
    [HttpPost("follow/user")]
    public async Task<IActionResult> FollowUser([FromBody] FollowUserCommand command)
    {
        try
        {
            _logger.LogInformation("User {FollowerId} followed user {FolloweeId}", command.FollowerId, command.FolloweeId);

            var result = await _mediator.Send(command);

            return Ok(new { success = true, followId = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error following user");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Bỏ theo dõi một user
    /// </summary>
    [HttpPost("unfollow/user")]
    public async Task<IActionResult> UnfollowUser([FromBody] UnfollowUserCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);

            if (!result)
            {
                return BadRequest(new BaseResponse<object> { Success = false, Message = "Failed to unfollow user" });
            }

            return Ok(new BaseResponse<object> { Success = true, Message = "Unfollowed user successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unfollowing user");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Kiểm tra đang theo dõi user không
    /// </summary>
    [HttpGet("follow/user/check/{followerId}/{followeeId}")]
    public async Task<IActionResult> IsFollowingUser(string followerId, string followeeId)
    {
        try
        {
            var result = await _mediator.Send(new IsFollowingUserQuery { FollowerId = followerId, FolloweeId = followeeId });
            return Ok(new { isFollowing = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking follow status");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách user đang theo dõi
    /// </summary>
    [HttpGet("follow/users/{followerId}")]
    public async Task<IActionResult> GetFollowingUsers(string followerId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetFollowingUsersQuery 
            { 
                FollowerId = followerId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting following users");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách người theo dõi của user
    /// </summary>
    [HttpGet("followers/users/{followeeId}")]
    public async Task<IActionResult> GetUserFollowers(string followeeId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetUserFollowersQuery 
            { 
                FolloweeId = followeeId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user followers");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Đếm số người theo dõi user
    /// </summary>
    [HttpGet("followers/count/{followeeId}")]
    public async Task<IActionResult> GetUserFollowerCount(string followeeId)
    {
        try
        {
            var count = await _mediator.Send(new GetUserFollowerCountQuery { FolloweeId = followeeId });
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting follower count");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    #endregion

    #region ==================== FOLLOW ARTISTS ====================

    /// <summary>
    /// Theo dõi một nghệ sĩ
    /// </summary>
    [HttpPost("follow/artist")]
    public async Task<IActionResult> FollowArtist([FromBody] FollowArtistCommand command)
    {
        try
        {
            _logger.LogInformation("User {FollowerId} followed artist {ArtistId}", command.FollowerId, command.ArtistId);

            var result = await _mediator.Send(command);

            return Ok(new { success = true, followId = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error following artist");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Bỏ theo dõi một nghệ sĩ
    /// </summary>
    [HttpPost("unfollow/artist")]
    public async Task<IActionResult> UnfollowArtist([FromBody] UnfollowArtistCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);

            if (!result)
            {
                return BadRequest(new BaseResponse<object> { Success = false, Message = "Failed to unfollow artist" });
            }

            return Ok(new BaseResponse<object> { Success = true, Message = "Unfollowed artist successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unfollowing artist");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Kiểm tra đang theo dõi nghệ sĩ không
    /// </summary>
    [HttpGet("follow/artist/check/{followerId}/{artistId}")]
    public async Task<IActionResult> IsFollowingArtist(string followerId, Guid artistId)
    {
        try
        {
            var result = await _mediator.Send(new IsFollowingArtistQuery { FollowerId = followerId, ArtistId = artistId });
            return Ok(new { isFollowing = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking follow status");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách nghệ sĩ đang theo dõi
    /// </summary>
    [HttpGet("follow/artists/{followerId}")]
    public async Task<IActionResult> GetFollowingArtists(string followerId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetFollowingArtistsQuery 
            { 
                FollowerId = followerId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting following artists");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Lấy danh sách người theo dõi của nghệ sĩ
    /// </summary>
    [HttpGet("followers/artists/{artistId}")]
    public async Task<IActionResult> GetArtistFollowers(Guid artistId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var result = await _mediator.Send(new GetArtistFollowersQuery 
            { 
                ArtistId = artistId, 
                PageNumber = pageNumber, 
                PageSize = pageSize 
            });

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artist followers");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    /// <summary>
    /// Đếm số người theo dõi của nghệ sĩ
    /// </summary>
    [HttpGet("followers/artist/count/{artistId}")]
    public async Task<IActionResult> GetArtistFollowerCount(Guid artistId)
    {
        try
        {
            var count = await _mediator.Send(new GetArtistFollowerCountQuery { ArtistId = artistId });
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artist follower count");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    #endregion

    #region ==================== FOLLOW STATISTICS ====================

    /// <summary>
    /// Lấy thống kê theo dõi (followers, following users, following artists)
    /// </summary>
    [HttpGet("stats/{userId}")]
    public async Task<IActionResult> GetFollowStats(string userId)
    {
        try
        {
            var result = await _mediator.Send(new GetFollowStatsQuery { UserId = userId });
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting follow stats");
            return StatusCode(500, new BaseResponse<object> { Success = false, Message = "Internal server error" });
        }
    }

    #endregion
}