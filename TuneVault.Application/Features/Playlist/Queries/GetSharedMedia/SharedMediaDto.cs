using System;
namespace TuneVault.Application.Features.Playlist.DTOs
{
    public class SharedMediaDto
    {
        public Guid ShareId { get; set; }
        public Guid MediaId { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string FilePath { get; set; }
        public string ThumbnailUrl { get; set; }
        public string SenderName { get; set; }
        public DateTime SharedAt { get; set; }
    }
}