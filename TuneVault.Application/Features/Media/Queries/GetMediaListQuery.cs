using MediatR;
using System.Collections.Generic;

namespace TuneVault.Application.Features.Media.Queries
{
    // Yêu cầu trả về một danh sách các bài nhạc
    public class GetMediaListQuery : IRequest<List<MediaItem>>
    {
    }
}