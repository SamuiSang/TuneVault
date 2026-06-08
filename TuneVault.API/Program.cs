using TuneVault.API.Middlewares;
using TuneVault.Application;
using TuneVault.Infrastructure;
using TuneVault.Infrastructure.Identity;
using TuneVault.Infrastructure.SignalR;

using TuneVault.Infrastructure.Repositories; 
using TuneVault.Infrastructure.Services;

using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;

using System.Data; // Đã thêm dấu chấm phẩy
using Microsoft.AspNetCore.Identity; // Bắt buộc cho Identity
using TuneVault.Domain.Entities.Users; // Trỏ tới class AppUser của bạn

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDataProtection();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IMediaShareRepository, MediaShareRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
// ---> SIGNALR SERVICE <---
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
// ---> CẤU HÌNH IDENTITY CHẠY ĐỘC LẬP (KHÔNG DÙNG EF CORE) <---
builder.Services.AddIdentityCore<AppUser>(options => {
    // Nới lỏng quy tắc mật khẩu cho dễ test
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddUserStore<DapperUserStore>() // Lệnh mới thêm: Báo cho Identity biết hãy dùng Dapper!
.AddDefaultTokenProviders()
.AddDefaultTokenProviders();
// (Ghi chú: Sau khi tạo xong file DapperUserStore, chúng ta sẽ thêm lệnh đăng ký nó vào ngay dưới dòng này)

// ---> KÍCH HOẠT KẾT NỐI DATABASE VÀ REPOSITORY <---
builder.Services.AddInfrastructureServices(builder.Configuration); // Dapper và các Repo

// ---> PIPELINE MEDIATR <---
builder.Services.AddApplicationServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ---> ĐĂNG KÝ MIDDLEWARE HỨNG LỖI, TEST PIPELINE <---
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

// ---> MIDDLEWARE BẢO MẬT <---
app.UseAuthentication(); // Hỏi "Bạn là ai?"
app.UseAuthorization();  // Hỏi "Bạn có quyền làm việc này không?"

// ---> MAP SIGNALR HUB <---
app.MapHub<NotificationHub>("/hubs/notifications");

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();