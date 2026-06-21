using MediatR;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Follows.FollowArtistCommand;
using TuneVault.Application.Features.Follows.GetFollowersQuery;
using TuneVault.Application.Features.Follows.GetFollowingQuery;

[ApiController]
[Microsoft.AspNetCore.Components.Route("api/follows")]
public class FollowsController : ControllerBase
{
    private readonly IMediator _mediator;

    public FollowsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> Follow(
        FollowArtistCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("followers/{userId}")]
    public async Task<IActionResult> Followers(
        string userId)
    {
        return Ok(
            await _mediator.Send(
                new GetFollowersQuery(userId)));
    }

    [HttpGet("following/{userId}")]
    public async Task<IActionResult> Following(
        string userId)
    {
        return Ok(
            await _mediator.Send(
                new GetFollowingQuery(userId)));
    }
}