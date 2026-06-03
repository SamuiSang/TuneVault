using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace TuneVault.Application.Common.Behaviors;

public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    // Inject các service kiểm tra user hiện tại ở đây (ví dụ ICurrentUserService)

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        // Logic kiểm tra quyền sẽ viết ở đây
        // Nếu không có quyền: throw new UnauthorizedAccessException();

        return await next();
    }
}