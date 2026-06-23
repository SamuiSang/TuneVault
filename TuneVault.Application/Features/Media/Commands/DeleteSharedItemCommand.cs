using MediatR;

namespace TuneVault.Application.Features.Media.Commands;

public class DeleteSharedItemCommand : IRequest<bool>
{
    public required string ReceiverId { get; set; }
    public required IEnumerable<Guid> ShareIds { get; set; }
}
