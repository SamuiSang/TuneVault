using MediatR;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchMedia;

public class SearchMediaQuery : IRequest<IEnumerable<TrackDto>>
{
    public SearchMediaQuery(string keyword)
    {
        Keyword = keyword;
    }

    public string Keyword { get; set; } = string.Empty;
}