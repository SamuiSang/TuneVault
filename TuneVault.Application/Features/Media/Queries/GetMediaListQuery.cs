using MediatR;
using System.Collections.Generic;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Features.Media.Queries
{
    public class GetMediaListQuery : IRequest<List<MediaItem>>
    {
    }
}