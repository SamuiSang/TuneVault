
---

# Dự án Ứng dụng Phát nhạc Trực tuyến (Spotify Clone)

## 📌 Tóm tắt Dự án

* 
**Frontend (20%):** Xây dựng bằng React và TypeScript với giao diện tối (dark theme), bao gồm thanh điều hướng, vùng nội dung và player bar cố định.


* 
**Backend (80%):** Xây dựng bằng ASP.NET Core 8+ Web API, tuân thủ nghiêm ngặt mô hình Clean Architecture gồm 4 layer.


* 
**Cơ sở dữ liệu:** Tối thiểu 10 bảng, sử dụng SQL Server kết hợp Entity Framework Core 8+.


* 
**Điểm nhấn:** Sử dụng Application Pipeline cho 10 chức năng lõi, tích hợp SignalR cho thông báo real-time và cơ hội lấy điểm thưởng bằng cách tích hợp AI (Anthropic Claude) hoặc CI/CD.



---

## 🛠 Công cụ & Công nghệ

* 
**Frontend:** Visual Studio Code, Node.js (React + TypeScript).


* 
**Backend:** Visual Studio Community 2026, .NET 8.0 SDK.


* 
**Database:** SQL Server, SQL Server Management Studio (SSMS), Entity Framework Core 8+.


* 
**Testing & API:** Postman, Swagger.



---

## 🏗 Kiến trúc Backend (Clean Architecture)

* Dự án được chia thành 4 project độc lập: Domain, Application, Infrastructure và API.


* Quy tắc sống còn: Domain không được phụ thuộc vào bất kỳ layer nào khác.


* Controller tuyệt đối không chứa logic nghiệp vụ và chỉ được phép gọi đến Application layer.



### Application Pipeline

* 10 chức năng bắt buộc phải chạy qua một pipeline xử lý request thống nhất, khuyến khích sử dụng thư viện MediatR.


* Quy trình chuẩn của Pipeline: Validation (Fluent Validation) => Authorization => Handler => Persistence => Side effects => Response mapping.



---

## 🚀 Tính năng Cốt lõi

* 
**Xử lý Media:** Hỗ trợ API upload multipart cho cả audio và video, cùng API phát stream video có hỗ trợ Range header.


* 
**Tương tác Real-time (*):** Tính năng Chia sẻ Media và Thông báo được đánh giá rất kỹ.


* 
**Luồng thông báo:** Khi người dùng chia sẻ nhạc/playlist, hệ thống phải lưu vào Database và lập tức đẩy thông báo qua SignalR cho người nhận.


* 
**Quản lý Tài khoản:** Tích hợp gói ASP.NET Core Identity để xử lý bảo mật, băm mật khẩu, đăng ký/đăng nhập và cấp phát mã xác thực JWT.


* 
**Tích hợp AI (Điểm thưởng):** Gọi API Anthropic Claude từ Application layer để tự động tạo mô tả bài hát, gợi ý playlist hoặc phân loại tag dựa trên lịch sử nghe nhạc.



---

## 💻 Giao diện Frontend

* Giao diện cần mô phỏng ứng dụng Spotify với ít nhất 8 màn hình/route như Home, Search, Library, Playlist, Share Inbox, v.v..


* UI tách biệt rõ ràng: Có Player bar cố định bên dưới để phát Audio, và một màn hình riêng (hoặc modal) dành cho Video player.


* Gọi API thông qua lớp service (ví dụ Axios), có định nghĩa TypeScript interfaces khớp hoàn toàn với các DTO trả về từ Backend.


* Lắng nghe sự kiện thông báo từ Client SignalR để hiển thị badge số lượng thông báo chưa đọc.



---

## 🗄 Cấu trúc Cơ sở dữ liệu

Dự án sử dụng sơ đồ ERD với tối thiểu 10 bảng cốt lõi.

| Tên Bảng | Vai trò chính & Ràng buộc nổi bật |
| --- | --- |
| **AspNetUsers** | Quản lý người dùng, kế thừa IdentityUser, tích hợp ASP.NET Core Identity.

 |
| **Artist** | Lưu thông tin chi tiết (Tên, Tiểu sử) của nghệ sĩ/ca sĩ.

 |
| **Album** | Phân loại media theo album, có khóa ngoại trỏ đến Artist.

 |
| **MediaItem** | Chứa thông tin file vật lý (Audio/Video). Bổ sung trường Description để lưu tóm tắt do AI sinh ra.

 |
| **MediaArtist** | Bảng trung gian giải quyết quan hệ nhiều-nhiều để hỗ trợ 1 bài hát có nhiều ca sĩ hát chung.

 |
| **Playlist** | Lưu danh sách phát nhạc/video tự tạo (công khai hoặc riêng tư).

 |
| **PlaylistTrack** | Bảng trung gian (nhiều-nhiều) để thêm/xóa bài hát khỏi Playlist.

 |
| **MediaShare** | Lưu lịch sử chia sẻ. Trường MediaItemId và PlaylistId phải là Nullable để chia sẻ linh hoạt 1 bài hát hoặc 1 playlist.

 |
| **Notification** | Lưu trạng thái thông báo trong hệ thống trước khi đẩy qua SignalR Hub.

 |
| **Favorite** | Bảng trung gian lưu danh sách các bài hát/video được người dùng yêu thích.

 |
| **PlayHistory** | Ghi nhận lịch sử nghe nhạc gần đây, làm đầu vào cho prompt AI phân tích xu hướng.

 |
| **Follow** | Quản lý theo dõi. Tách bạch FolloweeId và ArtistId (Nullable) để phân biệt theo dõi người dùng thường và nghệ sĩ.

 |

---

## 🗓 Lộ trình Phát triển

* 
**Giai đoạn 1:** Chuẩn bị công cụ cài đặt, vẽ sơ đồ ERD và thiết kế cơ sở dữ liệu cho tối thiểu 10 bảng.


* 
**Giai đoạn 2:** Khởi tạo kiến trúc Clean Architecture, thiết lập quy tắc phụ thuộc, định nghĩa Domain Entities và cấu hình DbContext để chạy Migrations.


* 
**Giai đoạn 3:** Xây dựng Application Pipeline với MediatR, hoàn thiện tính năng xác thực, upload/stream Media và các API CRUD.


* 
**Giai đoạn 4:** Xây dựng tính năng chia sẻ, tích hợp SignalR Hub cho thông báo real-time và tài liệu hóa API bằng Swagger/Postman.


* 
**Giai đoạn 5:** Khởi tạo dự án Frontend React + TypeScript bằng Vite, xây dựng layout mô phỏng Spotify, định tuyến màn hình và tích hợp API cũng như Media Player.


* 
**Giai đoạn 6:** Hoàn thiện tài liệu (README, xuất sơ đồ), tích hợp AI sinh mô tả để lấy điểm thưởng và cân nhắc quay video demo.
