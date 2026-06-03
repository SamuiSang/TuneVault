using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Test;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly IMediator _mediator;

    public TestController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("pipeline")]
    public async Task<IActionResult> TestPipeline([FromBody] TestPipelineCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}