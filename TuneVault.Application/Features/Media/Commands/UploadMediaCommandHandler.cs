using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

using Dapper;
using Microsoft.Data.SqlClient;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.Features.Media.Commands
{
    public class UploadMediaCommandHandler : IRequestHandler<UploadMediaCommand, Guid>
    {
        private readonly IConfiguration _configuration;

        public UploadMediaCommandHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Guid> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
        {
            // 1. Tạo thư mục và lưu file vật lý vào wwwroot/uploads
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, request.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.FileStream.CopyToAsync(stream);
            }

            // 2. Gom thông tin để lưu vào Database
            var newMedia = new MediaItem
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Type = request.Type,
                Duration = request.Duration,
                OwnerId = request.OwnerId,
                AlbumId = request.AlbumId,
                FilePath = $"/uploads/{request.FileName}"
            };

            // 3. Dùng Dapper cất vào kho SQL Server
            var sql = @"INSERT INTO MediaItem (Id, Title, Type, Duration, OwnerId, AlbumId, FilePath) 
                        VALUES (@Id, @Title, @Type, @Duration, @OwnerId, @AlbumId, @FilePath)";

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                await connection.ExecuteAsync(sql, newMedia);
            }

            return newMedia.Id;
        }
    }
}