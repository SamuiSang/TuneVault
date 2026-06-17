using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

using Dapper;
using Microsoft.Data.SqlClient;
using TuneVault.Domain.Entities;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Media.Commands
{
    public class UploadMediaCommandHandler : IRequestHandler<UploadMediaCommand, Guid>
    {
        private readonly IConfiguration _configuration;
        private readonly ICloudStorageService _cloudStorageService;

        public UploadMediaCommandHandler(IConfiguration configuration, ICloudStorageService cloudStorageService)
        {
            _configuration = configuration;
            _cloudStorageService = cloudStorageService;
        }

        public async Task<Guid> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
        {
            // 1. Upload file trực tiếp lên Cloudinary
            string fileUrl = "";

            // Tùy theo loại file mà gọi method upload tương ứng
            // Đã sửa: Bổ sung thêm xử lý cho trường hợp "Podcast" để đẩy đúng vào tunevault/media
            if (request.Type.Equals("Audio", StringComparison.OrdinalIgnoreCase) || 
                request.Type.Equals("Video", StringComparison.OrdinalIgnoreCase) ||
                request.Type.Equals("Podcast", StringComparison.OrdinalIgnoreCase))
            {
                fileUrl = await _cloudStorageService.UploadAudioVideoAsync(request.FileStream, request.FileName, cancellationToken);
            }
            else
            {
                // Nếu hỗ trợ Image (ví dụ thumbnail) trong tương lai
                fileUrl = await _cloudStorageService.UploadImageAsync(request.FileStream, request.FileName, cancellationToken);
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
                FilePath = fileUrl // Đã đổi thành URL của Cloudinary
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