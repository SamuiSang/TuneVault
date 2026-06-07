using MediatR;
using TuneVault.Application.Features.Search.DTOs;

namespace TuneVault.Application.Features.Search.Queries.SearchPlaylists;

public class SearchPlaylistsQuery : IRequest<IEnumerable<PlaylistSearchDto>>
{
    public string Keyword { get; set; } = string.Empty;
}