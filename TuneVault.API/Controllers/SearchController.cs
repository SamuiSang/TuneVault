using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Search.Queries.SearchArtists;
using TuneVault.Application.Features.Search.Queries.SearchMedia;
using TuneVault.Application.Features.Search.Queries.SearchPlaylists;
using TuneVault.Application.Features.Search.Queries.SearchUsers;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly IMediator _mediator;

    public SearchController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("media")]
    public async Task<IActionResult> SearchMedia(
        [FromQuery] string keyword,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            request: new SearchMediaQuery(keyword),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("artists")]
    public async Task<IActionResult> SearchArtists(
        [FromQuery] string keyword,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            request: new SearchArtistsQuery(keyword),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("playlists")]
    public async Task<IActionResult> SearchPlaylists(
        [FromQuery] string keyword,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new SearchPlaylistsQuery(keyword),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> SearchUsers(
        [FromQuery] string keyword,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new SearchUsersQuery(keyword),
            cancellationToken);

        return Ok(result);
    }
}