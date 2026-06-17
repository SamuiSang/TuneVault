using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Playlist.Commands.AddTrackToPlaylist;
using TuneVault.Application.Features.Playlist.Commands.CreatePlaylist;
using TuneVault.Application.Features.Playlist.Commands.DeletePlaylist;
using TuneVault.Application.Features.Playlist.Commands.RemoveTrackFromPlaylist;
using TuneVault.Application.Features.Media.Commands;
using TuneVault.Application.Features.Playlist.Commands.UpdatePlaylist;
using TuneVault.Application.Features.Playlist.Queries.GetPlaylistDetail;
using TuneVault.Application.Features.Playlist.Queries.GetSharedMedia;
using TuneVault.Application.Features.Playlist.Queries.GetUserPlaylists;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlaylistsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlaylistsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Tạo playlist mới
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePlaylist(
        [FromBody] CreatePlaylistCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Cập nhật playlist
    /// </summary>
    [HttpPut("{playlistId:guid}")]
    public async Task<IActionResult> UpdatePlaylist(
        Guid playlistId,
        [FromBody] UpdatePlaylistCommand command,
        CancellationToken cancellationToken)
    {
        command.PlaylistId = playlistId;

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Xóa playlist
    /// </summary>
    [HttpDelete("{playlistId:guid}")]
    public async Task<IActionResult> DeletePlaylist(
        Guid playlistId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new DeletePlaylistCommand(playlistId),
            cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Chi tiết playlist
    /// </summary>
    [HttpGet("{playlistId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlaylistDetail(
        Guid playlistId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetPlaylistDetailQuery(playlistId),
            cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Danh sách playlist của user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserPlaylists(
        string userId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            request: new GetUserPlaylistsQuery(userId),
            cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Thêm bài hát vào playlist
    /// </summary>
    [HttpPost("{playlistId:guid}/tracks/{mediaId:guid}")]
    public async Task<IActionResult> AddTrack(
        Guid playlistId,
        Guid mediaId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new AddTrackToPlaylistCommand(
                playlistId,
                mediaId),
            cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Xóa bài hát khỏi playlist
    /// </summary>
    [HttpDelete("{playlistId:guid}/tracks/{mediaId:guid}")]
    public async Task<IActionResult> RemoveTrack(
        Guid playlistId,
        Guid mediaId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new RemoveTrackFromPlaylistCommand(
                playlistId,
                mediaId),
            cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Chia sẻ media hoặc playlist
    /// </summary>
    [HttpPost("share")]
    public async Task<IActionResult> ShareMedia(
        [FromBody] ShareMediaCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Danh sách nội dung được chia sẻ với tôi
    /// </summary>
    [HttpGet("shared-with-me/{userId}")]
    public async Task<IActionResult> GetSharedWithMe(
        string userId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetSharedWithMeQuery(userId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyPlaylists(
        CancellationToken cancellationToken)
    {
        var userId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(
            new GetUserPlaylistsQuery(userId),
            cancellationToken);

        return Ok(result);
    }
}