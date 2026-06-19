using System;
namespace TuneVault.Application.Features.Playlist.DTOs
{
    public class SharedMediaDto
    {
        public Guid ShareId { get; set; } 
        public Guid MediaId { get; set; }
        public string Title { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string FilePath { get; set; } = null!;
        public string ThumbnailUrl { get; set; } = null!;
        public string SenderName { get; set; } = null!;
        public DateTime SharedAt { get; set; }
    }
}