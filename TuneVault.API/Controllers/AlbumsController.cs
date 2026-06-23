using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Albums.Queries.GetAlbumById;
using TuneVault.Application.Features.Albums.Queries.GetAlbumsByArtistId;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlbumsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AlbumsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("artist/{artistId}")]
    public async Task<IActionResult> GetAlbumsByArtistId(string artistId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAlbumsByArtistIdQuery(artistId), cancellationToken);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAlbumById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAlbumByIdQuery(id), cancellationToken);
        if (result == null)
            return NotFound(new { success = false, message = "Album not found." });

        return Ok(new { success = true, data = result });
    }
}
