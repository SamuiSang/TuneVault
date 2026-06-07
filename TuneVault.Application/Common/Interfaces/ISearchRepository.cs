using TuneVault.Application.Features.Playlist.DTOs;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Common.Interfaces.Repositories;

public interface ISearchRepository
{
    Task<IEnumerable<TrackDto>> SearchMediaAsync(
        string keyword);

    Task<IEnumerable<ArtistDto>> SearchArtistsAsync(
        string keyword);

    Task<IEnumerable<PlaylistSearchDto>> SearchPlaylistsAsync(
        string keyword);
}