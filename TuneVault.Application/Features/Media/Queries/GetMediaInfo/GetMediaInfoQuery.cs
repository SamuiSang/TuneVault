using MediatR;
using TuneVault.Application.Common.Models;
using TuneVault.Application.Features.Media.DTOs;

namespace TuneVault.Application.Features.Media.Queries.GetMediaInfo;

/// <summary>
/// Query để lấy thông tin chi tiết của một media
/// </summary>
public record GetMediaInfoQuery(Guid MediaId) : IRequest<BaseResponse<MediaInfoDto>>;
