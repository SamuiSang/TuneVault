namespace TuneVault.Application.Common.Interfaces.Repositories;

/// <summary>
/// Repository interface cho MediaShare entity
/// </summary>
public interface IMediaShareRepository
{
    Task<Guid> CreateMediaShareAsync(CreateMediaShareRequest request, CancellationToken cancellationToken = default);
    Task<bool> HasSharedInLast24HoursAsync(string senderId, string receiverId, Guid? mediaItemId, Guid? playlistId, CancellationToken cancellationToken);
    Task<bool> DeleteSharedItemsAsync(string receiverId, IEnumerable<Guid> shareIds, CancellationToken cancellationToken = default);
    Task<bool> IsPlaylistSharedWithUserAsync(Guid playlistId, string userId, CancellationToken cancellationToken = default);
}

public record CreateMediaShareRequest(
    string SenderId,
    string ReceiverId,
    Guid? MediaItemId = null,
    Guid? PlaylistId = null
);
