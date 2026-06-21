using MediatR;

namespace TuneVault.Application.Features.Likes.LikeSongCommand;

public record LikeSongCommand(
    string UserId,
    Guid MediaId
) : IRequest<Guid>;