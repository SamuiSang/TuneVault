using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Playlist.Commands.ShareMedia;

/// <summary>
/// Command để chia sẻ một bài hát/media tới người dùng khác
/// Tự động tạo notification cho người nhận
/// </summary>
public record ShareMediaCommand(
    Guid MediaId,
    string SenderId,
    string ReceiverId
) : IRequest<BaseResponse<Guid>>;
