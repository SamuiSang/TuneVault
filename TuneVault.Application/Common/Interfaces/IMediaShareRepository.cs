namespace TuneVault.Application.Common.Interfaces.Repositories;

/// <summary>
/// Repository interface cho MediaShare entity
/// </summary>
public interface IMediaShareRepository
{
    Task<Guid> CreateMediaShareAsync(CreateMediaShareRequest request, CancellationToken cancellationToken = default);
}

public record CreateMediaShareRequest(
    string SenderId,
    string ReceiverId,
    Guid? MediaItemId = null,
    Guid? PlaylistId = null
);
