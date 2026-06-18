using MediatR;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Playlist.DTOs;

namespace TuneVault.Application.Features.Playlist.Queries.GetSharedMedia
{
    public class GetSharedWithMeQueryHandler : IRequestHandler<GetSharedWithMeQuery, BaseResponse<IEnumerable<SharedMediaDto>>>
    {
        private readonly IConfiguration _configuration;
        public GetSharedWithMeQueryHandler(IConfiguration configuration) { _configuration = configuration; }

        public async Task<BaseResponse<IEnumerable<SharedMediaDto>>> Handle(GetSharedWithMeQuery request, CancellationToken cancellationToken)
        {
            var sql = @"
                SELECT ms.Id AS ShareId, m.Id AS MediaId, m.Title, m.Type, m.FilePath, m.ThumbnailUrl, u.UserName AS SenderName, ms.SharedAt
                FROM MediaShare ms
                INNER JOIN MediaItem m ON ms.MediaItemId = m.Id
                INNER JOIN AppUser u ON ms.SenderId = u.Id
                WHERE ms.ReceiverId = @UserId ORDER BY ms.SharedAt DESC";

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var result = await connection.QueryAsync<SharedMediaDto>(sql, new { UserId = request.UserId });
                return new BaseResponse<IEnumerable<SharedMediaDto>>(result, true, "Lấy danh sách chia sẻ thành công!");
            }
        }
    }
}