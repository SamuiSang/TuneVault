//Theo sơ đồ ERD, phần lớn các bảng (ngoại trừ AppUser dùng string Id mặc định của IdentityUser)
//đều sử dụng khóa chính dạng guid. Việc tạo BaseEntity giúp
//không phải lặp lại việc khai báo khóa chính cho các Entity khác.
using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Entities
{
    public abstract class BaseEntity
    {
        // Sử dụng POCO chuẩn với get; set;
        public Guid Id { get; set; } = Guid.NewGuid();

        // Có thể bổ sung thêm các trường dùng chung nếu muốn sau này 
        // ví dụ: public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
