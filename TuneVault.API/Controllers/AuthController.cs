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
    private readonly TuneVault.Application.Common.Interfaces.IUserRepository _userRepository;

    public AuthController(IMediator mediator, TuneVault.Application.Common.Interfaces.IUserRepository userRepository)
    {
        _mediator = mediator;
        _userRepository = userRepository;
    }
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

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? 
                    User.FindFirst("id")?.Value ?? 
                    User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("Không tìm thấy thông tin người dùng.");
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return NotFound("Người dùng không tồn tại.");
        }

        return Ok(new UserProfileResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            DisplayName = user.DisplayName, // Cập nhật dòng này
            Email = user.Email,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            IsArtist = user.IsArtist // Cập nhật dòng này
        });
    }
    public class VerifyArtistRequest { public string Password { get; set; } = string.Empty; }

    [Authorize]
    [HttpPost("verify-artist")]
    public async Task<IActionResult> VerifyArtist([FromBody] VerifyArtistRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();
        
        // Gọi tới Command vừa tạo
        var result = await _mediator.Send(new TuneVault.Application.Features.Auth.Commands.VerifyArtist.VerifyArtistCommand(userId, request.Password));
        
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? 
                    User.FindFirst("id")?.Value ?? 
                    User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("Không tìm thấy thông tin người dùng.");
        }

        var command = new UpdateProfileCommand
        {
            UserId = userId,
            DisplayName = request.DisplayName, // Gắn DisplayName từ Request vào Command
            Bio = request.Bio,
            AvatarUrl = request.AvatarUrl
        };

        var isSuccess = await _mediator.Send(command);
        if (!isSuccess) return BadRequest("Cập nhật thông tin Profile thất bại.");

        return Ok(new { Message = "Cập nhật Profile thành công." });
    }
}
public class UpdateProfileRequest
{
    public string? DisplayName { get; set; } // Thêm dòng này
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}

public class UserProfileResponse
{
    public string Id { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? DisplayName { get; set; } // Thêm dòng này
    public string? Email { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsArtist { get; set; } // Thêm dòng này
}
