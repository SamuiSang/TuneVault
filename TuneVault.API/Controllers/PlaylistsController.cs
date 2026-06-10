using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Playlist.Commands.ShareMedia;

namespace TuneVault.API.Controllers;

/// <summary>
/// REST API cho playlist và chia sẻ media
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PlaylistsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PlaylistsController> _logger;

    public PlaylistsController(IMediator mediator, ILogger<PlaylistsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Chia sẻ media tới user khác (lưu MediaShare + tạo notification real-time)
    /// </summary>
    [HttpPost("share/media")]
    public async Task<IActionResult> ShareMedia([FromBody] ShareMediaCommand command)
    {
        try
        {
            _logger.LogInformation(
                "Share media {MediaId} from {SenderId} to {ReceiverId}",
                command.MediaId, command.SenderId, command.ReceiverId);

            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (ValidationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sharing media {MediaId}", command.MediaId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi chia sẻ media!"));
        }
    }

    [HttpGet("shared-with-me/{userId}")]
    public async Task<IActionResult> GetSharedWithMe(string userId)
    {
        var query = new Application.Features.Playlist.Queries.GetSharedMedia.GetSharedWithMeQuery(userId);
        var result = await _mediator.Send(query);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
}
