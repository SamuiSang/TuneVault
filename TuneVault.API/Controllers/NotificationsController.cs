using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.Commands.CreateNotification;
using TuneVault.Application.Features.Notifications.Commands.DeleteNotification;
using TuneVault.Application.Features.Notifications.Commands.MarkAsRead;
using TuneVault.Application.Features.Notifications.Queries.GetUnreadNotifications;
using TuneVault.Application.Features.Notifications.Queries.GetUserNotifications;

namespace TuneVault.API.Controllers;

/// <summary>
/// REST API cho notifications
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(IMediator mediator, ILogger<NotificationsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Tạo thông báo mới và đẩy real-time qua SignalR
    /// </summary>
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateNotificationDto dto)
    {
        try
        {
            var command = new CreateNotificationCommand(dto.UserId, dto.Type, dto.PayloadJson);
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
            _logger.LogError(ex, "Error creating notification");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi tạo thông báo!"));
        }
    }

    /// <summary>
    /// Lấy danh sách thông báo của user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserNotifications(string userId)
    {
        try
        {
            var result = await _mediator.Send(new GetUserNotificationsQuery(userId));

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
            _logger.LogError(ex, "Error getting notifications for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi lấy thông báo!"));
        }
    }

    /// <summary>
    /// Lấy thông báo chưa đọc của user
    /// </summary>
    [HttpGet("user/{userId}/unread")]
    public async Task<IActionResult> GetUnreadNotifications(string userId)
    {
        try
        {
            var result = await _mediator.Send(new GetUnreadNotificationsQuery(userId));

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
            _logger.LogError(ex, "Error getting unread notifications for user {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi lấy thông báo chưa đọc!"));
        }
    }

    /// <summary>
    /// Đánh dấu thông báo đã đọc
    /// </summary>
    [HttpPut("{notificationId:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid notificationId)
    {
        try
        {
            var result = await _mediator.Send(new MarkNotificationAsReadCommand(notificationId));

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
        catch (ValidationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification {NotificationId} as read", notificationId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi cập nhật thông báo!"));
        }
    }

    /// <summary>
    /// Xóa thông báo
    /// </summary>
    [HttpDelete("{notificationId:guid}")]
    public async Task<IActionResult> Delete(Guid notificationId)
    {
        try
        {
            var result = await _mediator.Send(new DeleteNotificationCommand(notificationId));

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
        catch (ValidationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting notification {NotificationId}", notificationId);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new BaseResponse<string>(message: "Lỗi khi xóa thông báo!"));
        }
    }
}
