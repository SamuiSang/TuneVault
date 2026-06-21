using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Auth.Commands.Login;

public record LoginCommand(string EmailOrUsername, string Password) : IRequest<BaseResponse<string>>;