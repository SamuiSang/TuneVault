using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<BaseResponse<string>>;