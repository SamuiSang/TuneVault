using TuneVault.API.Middlewares;
using TuneVault.Application;
using TuneVault.Infrastructure;
using TuneVault.Infrastructure.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ---> SIGNALR SERVICE <---
builder.Services.AddSignalR();

// ---> KÍCH HOẠT KẾT NỐI DATABASE VÀ REPOSITORY <---
builder.Services.AddInfrastructureServices(builder.Configuration); // dapper
// ---> PIPELINE MEDIATR <---
builder.Services.AddApplicationServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ---> ĐĂNG KÝ MIDDLEWARE HỨNG LỖI, TEST PIPELINE <---
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

// ---> MAP SIGNALR HUB <---
app.MapHub<NotificationHub>("/hubs/notifications");

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();
