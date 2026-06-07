using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Search.DTOs;

public class SearchResultDto
{
    public IEnumerable<TrackDto> Tracks { get; set; }
        = Enumerable.Empty<TrackDto>();

    public IEnumerable<ArtistDto> Artists { get; set; }
        = Enumerable.Empty<ArtistDto>();

    public IEnumerable<PlaylistSearchDto> Playlists { get; set; }
        = Enumerable.Empty<PlaylistSearchDto>();
}