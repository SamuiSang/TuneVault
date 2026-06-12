using MediatR;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Media.DTOs;

namespace TuneVault.Application.Features.Media.Queries.GetMediaMetadata;

/// <summary>
/// Query để lấy metadata của một media
/// Metadata bao gồm: title, duration, file size, content type, etc.
/// </summary>
public record GetMediaMetadataQuery(Guid MediaId) : IRequest<BaseResponse<MediaMetadataDto>>;
