using MediatR;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Domain.Entities;   
namespace TuneVault.Application.Features.Likes.LikeSongCommand;

public class LikeSongCommandHandler
    : IRequestHandler<LikeSongCommand, Guid>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public LikeSongCommandHandler(
        IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<Guid> Handle(
        LikeSongCommand request,
        CancellationToken cancellationToken)
    {
        var favorite = new Favorite { Id = Guid.NewGuid(), UserId = request.UserId, MediaItemId = request.MediaId, CreatedAt = DateTime.UtcNow };

        await _favoriteRepository.AddAsync(favorite);

        return favorite.Id;
    }
}