using TuneVault.Application.Features.Albums.DTOs;

namespace TuneVault.Application.Common.Interfaces;

public interface IAlbumRepository
{
    Task<IEnumerable<AlbumDto>> GetAlbumsByArtistIdAsync(string artistId);
    Task<AlbumDetailDto?> GetAlbumByIdAsync(Guid albumId);
}
