using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Features.Auth.Commands.Login;
using TuneVault.Application.Features.Auth.Commands.Register;
using TuneVault.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

using TuneVault.Application.Features.Auth.Commands.UpdateProfile;
namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // Tự động bóc tách lấy UserId từ trong cái Token JWT mà Frontend gửi lên
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                 ?? User.FindFirst("id")?.Value 
                 ?? User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
    {
        // In ra danh sách các thẻ có trong Token để xem các bạn kia đặt tên là gì
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"Thẻ trong Token: {claim.Type} = {claim.Value}");
        }
        return Unauthorized("Không tìm thấy thông tin người dùng.");
    }

        // Đóng gói vào Command để đẩy qua MediatR
        var command = new UpdateProfileCommand
        {
            UserId = userId,
            Bio = request.Bio,
            AvatarUrl = request.AvatarUrl
        };

        var isSuccess = await _mediator.Send(command);

        if (!isSuccess)
            return BadRequest("Cập nhật thông tin Profile thất bại.");

        return Ok(new { Message = "Cập nhật Profile thành công." });
    }
}
public class UpdateProfileRequest
{
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}