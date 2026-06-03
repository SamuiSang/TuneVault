using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Data;

namespace TuneVault.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Lấy chuỗi kết nối từ appsettings.json của tầng API
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Đăng ký IDbConnection với vòng đời Transient cho Dapper
            services.AddTransient<IDbConnection>((sp) => new SqlConnection(connectionString));

            // Sau này bạn sẽ đăng ký các Repository ở đây. Ví dụ:
            // services.AddScoped<IMediaRepository, MediaRepository>();

            return services;
        }
    }
}