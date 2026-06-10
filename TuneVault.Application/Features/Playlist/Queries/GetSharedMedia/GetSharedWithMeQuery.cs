using MediatR;
using System.Collections.Generic;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetSharedMedia
{
    public record GetSharedWithMeQuery(string UserId) : IRequest<BaseResponse<IEnumerable<SharedMediaDto>>>;
}