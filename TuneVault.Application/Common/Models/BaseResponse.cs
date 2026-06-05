using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Application.Common.Models
{
    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public BaseResponse() { }

        public BaseResponse(T? data, bool success = true, string message = "")
        {
            Success = success;
            Message = message;
            Data = data;
            Errors = null;
        }

        public BaseResponse(string message)
        {
            Success = false;
            Message = message;
            Data = default;
            Errors = null;
        }

        public BaseResponse(List<string> errors, string message = "Validation Failed")
        {
            Success = false;
            Message = message;
            Errors = errors;
            Data = default;
        }

        public static BaseResponse<T> SuccessResponse(T data)
        {
            return new BaseResponse<T> { Success = true, Data = data, Errors = null };
        }

        public static BaseResponse<T> FailureResponse(List<string> errors)
        {
            return new BaseResponse<T> { Success = false, Data = default, Errors = errors };
        }
    }
}
