using System;
namespace TuneVault.Application.Features.Playlist.DTOs
{
    public class SharedMediaDto
    {
        public Guid ShareId { get; set; } 
        public Guid? MediaId { get; set; }
        public Guid? PlaylistId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? FilePath { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public DateTime SharedAt { get; set; }
    }
}