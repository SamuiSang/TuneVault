namespace TuneVault.Application.Features.Media.DTOs;

/// <summary>
/// DTO cho Media stream response
/// Chứa file stream data và metadata
/// </summary>
public class MediaStreamDto
{
    /// <summary>
    /// File stream
    /// </summary>
    public required Stream FileStream { get; set; }

    /// <summary>
    /// MIME type của file (audio/mpeg, video/mp4, etc.)
    /// </summary>
    public required string ContentType { get; set; }

    /// <summary>
    /// Tên file
    /// </summary>
    public required string FileName { get; set; }

    /// <summary>
    /// Kích thước file (bytes)
    /// </summary>
    public required long FileSize { get; set; }

    /// <summary>
    /// Range bắt đầu (nếu có partial content)
    /// </summary>
    public long? RangeStart { get; set; }

    /// <summary>
    /// Range kết thúc (nếu có partial content)
    /// </summary>
    public long? RangeEnd { get; set; }
}
