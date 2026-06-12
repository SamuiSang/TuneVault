using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;
<<<<<<< HEAD
using TuneVault.Infrastructure.Services;
using TuneVault.Infrastructure.Repositories;
=======
using TuneVault.Domain.Entities.Users;
using TuneVault.Infrastructure.Authentication;
using TuneVault.Infrastructure.Persistence;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.SignalR;
>>>>>>> 0ca8b5a94c779c737b1f46a2b2f933bab2e5ee93

namespace TuneVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
<<<<<<< HEAD
            services.AddTransient<ITokenService, TokenService>();
            // Lấy chuỗi kết nối từ appsettings.json của tầng API
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddScoped<IPlaylistRepository, PlaylistRepository>();
            services.AddScoped<ISearchRepository, SearchRepository>();
            
            // Đăng ký các Repositories cho Interactions & History
            services.AddScoped<IFavoriteRepository, FavoriteRepository>();
            services.AddScoped<IPlayHistoryRepository, PlayHistoryRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            
            // Đăng ký IDbConnection với vòng đời Transient cho Dapper
=======
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

>>>>>>> 0ca8b5a94c779c737b1f46a2b2f933bab2e5ee93
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