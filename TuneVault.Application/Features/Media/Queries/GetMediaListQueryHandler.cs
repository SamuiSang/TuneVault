using MediatR;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace TuneVault.Application.Features.Media.Queries
{
    public class GetMediaListQueryHandler : IRequestHandler<GetMediaListQuery, List<MediaItem>>
    {
        private readonly IConfiguration _configuration;

        public GetMediaListQueryHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<MediaItem>> Handle(GetMediaListQuery request, CancellationToken cancellationToken)
        {
            // Câu lệnh SQL lấy tất cả bài nhạc
            var sql = "SELECT * FROM MediaItem ORDER BY Title ASC";

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                // Dapper tự động map dữ liệu từ SQL vào List<MediaItem>
                var result = await connection.QueryAsync<MediaItem>(sql);
                return result.ToList();
            }
        }
    }
}