using MediatR;
using TuneVault.Application.Common.Interfaces.Repositories;

namespace TuneVault.Application.Features.Media.Commands;

public class DeleteSharedItemCommandHandler : IRequestHandler<DeleteSharedItemCommand, bool>
{
    private readonly IMediaShareRepository _mediaShareRepository;

    public DeleteSharedItemCommandHandler(IMediaShareRepository mediaShareRepository)
    {
        _mediaShareRepository = mediaShareRepository;
    }

    public async Task<bool> Handle(DeleteSharedItemCommand request, CancellationToken cancellationToken)
    {
        return await _mediaShareRepository.DeleteSharedItemsAsync(request.ReceiverId, request.ShareIds, cancellationToken);
    }
}
