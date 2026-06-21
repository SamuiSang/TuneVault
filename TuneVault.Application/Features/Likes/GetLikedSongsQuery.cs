using MediatR;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Features.Likes.GetLikedSongsQuery;

public record GetLikedSongsQuery(
    string UserId
) : IRequest<List<MediaItem>>;