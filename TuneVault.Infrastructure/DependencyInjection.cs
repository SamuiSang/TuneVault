using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;
using TuneVault.Infrastructure.Services;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.Configuration;

namespace TuneVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Cấu hình Cloudinary
            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
            services.AddScoped<ICloudStorageService, CloudinaryService>();

            services.AddTransient<ITokenService, TokenService>();
            // Lấy chuỗi kết nối từ appsettings.json của tầng API
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddScoped<IPlaylistRepository, PlaylistRepository>();
            services.AddScoped<ISearchRepository, SearchRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            // Đăng ký các Repositories cho Interactions & History
            services.AddScoped<IFavoriteRepository, FavoriteRepository>();
            services.AddScoped<IPlayHistoryRepository, PlayHistoryRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            services.AddScoped<IAlbumRepository, AlbumRepository>();
            
            // Đăng ký IDbConnection với vòng đời Transient cho Dapper
            services.AddTransient<IDbConnection>((sp) => new SqlConnection(connectionString));

            // Sau này bạn sẽ đăng ký các Repository ở đây. Ví dụ:
            // services.AddScoped<IMediaRepository, MediaRepository>();

            return services;
        }
    }
}