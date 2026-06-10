using TuneVault.API.Middlewares;
using TuneVault.Application;
using TuneVault.Infrastructure;
using TuneVault.Infrastructure.Identity;
using TuneVault.Infrastructure.SignalR;

using TuneVault.Infrastructure.Repositories; 
using TuneVault.Infrastructure.Services;

using TuneVault.Application.Common.Interfaces;
using TuneVault.Application.Common.Interfaces.Repositories;

using System.Data;
using Microsoft.AspNetCore.Identity; // Bắt buộc cho Identity
using TuneVault.Domain.Entities.Users; // Trỏ tới class AppUser của bạn

using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDataProtection();
// Add services to the container.
builder.Services.AddControllers();
//builder.Services.AddOpenApi(); //XUNG ĐỘT VỚI SWAGGER
builder.Services.AddScoped<IMediaShareRepository, MediaShareRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
// ---> SIGNALR SERVICE <---
builder.Services.AddSignalR();
//---> SWAGGER , BÁO CHO SWAGGER BIẾT RẰNG HỆ THỐNG ĐANG SỬ DỤNG XÁC THỰC BẰNG JWT BEARER <---
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập 'Bearer' [khoảng trắng] và chuỗi token của bạn vào ô bên dưới.\n\nVí dụ: 'Bearer eyJhbGciOiJIUzI1NiIs...'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer"),
            new List<string>()
        }
    });
 
});
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

// ---> CẤU HÌNH CORS <---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Đúng địa chỉ của React (không có dấu gạch chéo ở cuối)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Cần thiết để sau này chạy được SignalR (Thông báo)
    });
});

var app = builder.Build();

// ---> Configure the HTTP request PIPELINE <---
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi(); //xung đột với swagger
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ---> ĐĂNG KÝ MIDDLEWARE HỨNG LỖI, TEST PIPELINE <---
//app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

// ---> THÊM ĐÚNG DÒNG NÀY VÀO ĐÂY <---
app.UseCors("AllowFrontend");

// ---> MIDDLEWARE BẢO MẬT <---
app.UseAuthentication(); // Hỏi "Bạn là ai?"
app.UseAuthorization();  // Hỏi "Bạn có quyền làm việc này không?"

// ---> MAP SIGNALR HUB <---
app.MapHub<NotificationHub>("/hubs/notifications");

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();