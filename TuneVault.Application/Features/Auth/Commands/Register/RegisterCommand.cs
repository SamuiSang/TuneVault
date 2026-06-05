using MediatR;
using TuneVault.Application.Common.Models;
namespace TuneVault.Application.Features.Auth.Commands.Register
{
    public class RegisterCommand : IRequest<BaseResponse<string>>
    {
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}