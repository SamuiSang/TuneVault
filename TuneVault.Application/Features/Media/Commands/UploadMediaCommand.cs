using MediatR;
using System;
using System.IO;

namespace TuneVault.Application.Features.Media.Commands
{
    // Phiếu này trả về một mã Guid sau khi upload thành công
    public class UploadMediaCommand : IRequest<Guid>
    {
        public required string Title { get; set; }
        public required string Type { get; set; }
        public int Duration { get; set; }
        public required string OwnerId { get; set; }
        public Guid? AlbumId { get; set; }
        public required string FileName { get; set; }
        public required Stream FileStream { get; set; }
    }
}