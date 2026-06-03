using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;
using MediatR;
using TuneVault.Application.Common.Models;

namespace TuneVault.Application.Features.Test;

// 1. Request DTO
public class TestPipelineCommand : IRequest<BaseResponse<string>>
{
    public string Name { get; set; } = string.Empty;
}

// 2. Validator (Sẽ bị ValidationBehavior tóm lại nếu sai)
public class TestPipelineCommandValidator : AbstractValidator<TestPipelineCommand>
{
    public TestPipelineCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên không được để trống!")
            .MinimumLength(3).WithMessage("Tên phải có ít nhất 3 ký tự.");
    }
}

// 3. Handler (Chỉ chạy khi Validation thành công)
public class TestPipelineCommandHandler : IRequestHandler<TestPipelineCommand, BaseResponse<string>>
{
    public async Task<BaseResponse<string>> Handle(TestPipelineCommand request, CancellationToken cancellationToken)
    {
        return BaseResponse<string>.SuccessResponse($"Pipeline hoạt động hoàn hảo! Xin chào {request.Name}");
    }
}