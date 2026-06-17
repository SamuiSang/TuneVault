using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using TuneVault.Application.Common.Interfaces;

namespace TuneVault.Application.Common.Behaviors;

public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthorizationBehavior(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        // Kiểm tra xem Request hiện tại có yêu cầu xác thực không
        if (request is IAuthorizeRequest)
        {
            var user = _httpContextAccessor.HttpContext?.User;

            // Nếu chưa đăng nhập hoặc không có Claim NameIdentifier (UserId) -> Chặn cửa ngay
            if (user == null || !user.Identity!.IsAuthenticated || !user.HasClaim(c => c.Type == ClaimTypes.NameIdentifier))
            {
                throw new UnauthorizedAccessException("Bạn cần đăng nhập để thực hiện hành động này.");
            }
        }

        // Hợp lệ thì cho đi tiếp sang bước xử lý chính (Handler)
        return await next();
    }
}