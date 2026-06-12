using MediatR;
using TuneVault.Application.Features.Media.DTOs;

namespace TuneVault.Application.Features.Media.Queries.GetMediaStream;

/// <summary>
/// Query để lấy media stream
/// Hỗ trợ Range header cho partial content (206 Partial Content)
/// </summary>
public record GetMediaStreamQuery(
    Guid MediaId,
    long? RangeStart = null,
    long? RangeEnd = null
) : IRequest<MediaStreamDto?>;
