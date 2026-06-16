using MediatR;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Features.Auth.Commands.UpdateProfile;

// 1. Định nghĩa giỏ đựng dữ liệu gửi lên (Command)
public class UpdateProfileCommand : IRequest<bool>
{
    public string UserId { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}

// 2. Bộ xử lý logic (Handler)
public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, bool>
{
    private readonly IUserRepository _userRepository;

    public UpdateProfileCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        // Gọi xuống Repository để cập nhật DB
        return await _userRepository.UpdateProfileAsync(request.UserId, request.Bio, request.AvatarUrl);
    }
}