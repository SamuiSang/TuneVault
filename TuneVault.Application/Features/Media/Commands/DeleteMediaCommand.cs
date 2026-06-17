using MediatR;
using System;

namespace TuneVault.Application.Features.Media.Commands
{
    // Lệnh xóa bài hát nhận vào ID của bài hát và trả về kết quả True/False (Thành công/Thất bại)
    public class DeleteMediaCommand : IRequest<bool>
    {
        public Guid Id { get; set; }

        // Hàm khởi tạo để Frontend hoặc Controller dễ dàng truyền ID vào
        public DeleteMediaCommand(Guid id)
        {
            Id = id;
        }
    }
}