import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  // Nạp dữ liệu ban đầu từ Context (nếu có)
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
      // Lấy token từ localStorage ra để chứng minh danh tính với Backend
      const token = localStorage.getItem('token'); 
      console.log("===> Token lấy ra từ localStorage là:", token);
      const response = await axios.put('http://localhost:5277/api/auth/profile', { 
        bio, 
        avatarUrl 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert(response.data.message || "Cập nhật Profile thành công rồi nhé!");
      
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
            <label className="block text-sm font-bold text-spotify-subtext mb-2">Ảnh đại diện (URL Link)</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-3 bg-spotify-highlight border border-transparent rounded text-spotify-text focus:outline-none focus:border-spotify-subtext transition-colors"
              placeholder="Nhập đường dẫn ảnh (https://...)"
            />
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