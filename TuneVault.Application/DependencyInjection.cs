using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

using System.Reflection;
using TuneVault.Application.Common.Behaviors;

namespace TuneVault.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // Đăng ký FluentValidation
        services.AddValidatorsFromAssembly(assembly);

        // Đăng ký MediatR và Pipeline Behaviors
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(assembly);

            // Thứ tự add Behavior rất quan trọng: Auth -> Validate -> Handler
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });
        
        return services;
    }
}