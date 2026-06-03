// ---> PHỤC VỤ CHO VIỆC TEST PINELINE <---
using FluentValidation;
using System.Text.Json;
using TuneVault.Application.Common.Models;

namespace TuneVault.API.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Cho phép request đi tiếp vào Pipeline
        }
        catch (ValidationException ex)
        {
            // Bắt lỗi Validation từ tầng Application bắn ra
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var errors = ex.Errors.Select(e => e.ErrorMessage).ToList();
            var response = BaseResponse<string>.FailureResponse(errors);

            await context.Response.WriteAsJsonAsync(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
        catch (Exception)
        {
            // Bắt các lỗi hệ thống khác (Tùy chọn)
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var response = BaseResponse<string>.FailureResponse(new List<string> { "Đã có lỗi hệ thống xảy ra." });
            await context.Response.WriteAsJsonAsync(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
    }
}