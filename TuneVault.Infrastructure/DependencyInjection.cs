using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Domain.Entities.Users;
using TuneVault.Infrastructure.Authentication;
using TuneVault.Infrastructure.Persistence;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.SignalR;

namespace TuneVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppIdentityDbContext>(options =>
                options.UseInMemoryDatabase("TuneVaultIdentity"));

            services.AddIdentity<AppUser, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 4;
                })
                .AddEntityFrameworkStores<AppIdentityDbContext>()
                .AddDefaultTokenProviders();

            services.AddTransient<IDbConnection>((sp) => new SqlConnection(connectionString));

            // ---> ĐĂNG KÝ CÁC REPOSITORY <---
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IMediaRepository, MediaRepository>();
            services.AddScoped<IMediaShareRepository, MediaShareRepository>();

            // ---> ĐĂNG KÝ SIGNALR SERVICE <---
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}