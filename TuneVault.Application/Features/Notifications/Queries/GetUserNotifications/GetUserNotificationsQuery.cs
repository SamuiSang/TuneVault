using MediatR;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Notifications.DTOs;

namespace TuneVault.Application.Features.Notifications.Queries.GetUserNotifications;

/// <summary>
/// Query để lấy danh sách thông báo của một user
/// Trả về tất cả thông báo + số lượng chưa đọc
/// </summary>
public record GetUserNotificationsQuery(string UserId) : IRequest<BaseResponse<GetNotificationsResponseDto>>;
