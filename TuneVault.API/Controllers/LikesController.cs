using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Likes.GetLikedSongsQuery;
using TuneVault.Application.Features.Likes.LikeSongCommand;

[ApiController]
[Route("api/likes")]
public class LikesController : ControllerBase
{
    private readonly IMediator _mediator;

    public LikesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Like(
        LikeSongCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> LikedSongs(
        string userId)
    {
        return Ok(
            await _mediator.Send(
                new GetLikedSongsQuery(userId)));
    }
}