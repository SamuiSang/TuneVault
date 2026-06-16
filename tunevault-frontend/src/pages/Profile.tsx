import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  // Nạp dữ liệu ban đầu từ Context (nếu có)
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  // Xử lý upload ảnh thẳng lên Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      const formData = new FormData();
      formData.append('file', file);

      try {
          setIsUploading(true);
          const response = await fetch('http://localhost:5277/api/media/upload-image', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: formData
          });

          const result = await response.json();
          if (result.success) {
              // result.data chính là URL trả về từ Cloudinary
              console.log("Ảnh đã lên thư mục tunevault/images:", result.data);
              setAvatarUrl(result.data); // Cập nhật ngay khung URL
          } else {
              alert(result.message || "Lỗi khi upload ảnh!");
          }
      } catch (error) {
          console.error("Lỗi upload ảnh:", error);
          alert("Không thể kết nối đến server!");
      } finally {
          setIsUploading(false);
      }
  };

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
      // Lấy token từ localStorage ra để chứng minh danh tính với Backend
      const response = await api.put('/auth/profile', {
        bio,
        avatarUrl,
      });

      alert(response.data.message || "Cập nhật Profile thành công rồi nhé!");
      updateUser?.({ bio, avatarUrl });
    } catch (error: any) {
      console.error("Lỗi chi tiết từ Server:", error);
      // Hiện lỗi chi tiết từ Backend trả về nếu có
      alert(error.response?.data?.message || error.response?.data || "Có lỗi xảy ra, không thể cập nhật Profile.");
    }
  };

  // Nếu lỡ rớt vào trang này mà mất token thì báo lỗi nhẹ nhàng
  if (!user) {
    return <div className="text-spotify-subtext p-6">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="text-spotify-text max-w-3xl mx-auto mt-4 pb-24">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
      
      <div className="bg-spotify-elevated p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-spotify-highlight">
          <div className="w-32 h-32 bg-spotify-highlight rounded-full overflow-hidden flex items-center justify-center text-5xl font-bold shadow-md">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user.userName?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-spotify-subtext uppercase font-bold tracking-wider mb-1">Người dùng TuneVault</span>
            <h2 className="text-5xl font-bold mb-2">{user.userName}</h2>
            <p className="text-spotify-subtext">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-spotify-subtext mb-2">Ảnh đại diện (URL Link hoặc Tải lên)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="flex-1 p-3 bg-spotify-highlight border border-transparent rounded text-spotify-text focus:outline-none focus:border-spotify-subtext transition-colors"
                placeholder="Nhập đường dẫn ảnh (https://...)"
              />
              <label className={`bg-spotify-highlight hover:bg-white/20 text-white cursor-pointer px-4 py-3 rounded border border-transparent transition-colors flex items-center justify-center whitespace-nowrap ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-spotify-subtext mb-2">Tiểu sử</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-spotify-highlight border border-transparent rounded text-spotify-text focus:outline-none focus:border-spotify-subtext transition-colors min-h-[120px] resize-none"
              placeholder="Viết một chút về gu âm nhạc của bạn..."
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-spotify-primary text-black font-bold px-8 py-3 rounded-full hover:scale-105 hover:bg-green-400 transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;