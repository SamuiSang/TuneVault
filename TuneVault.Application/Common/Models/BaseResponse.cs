using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Application.Common.Models
{
    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

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
