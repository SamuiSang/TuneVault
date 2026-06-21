import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiCopy, FiCheckCircle, FiStar } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FollowButton from '../components/layout/FollowButton';

const Profile = () => {
  const { id } = useParams(); // Lấy ID từ URL nếu đang xem profile người khác
  const { user, updateUser } = useAuth();
  
  // Xác định xem đang ở nhà mình hay nhà người ta
  const isMyProfile = !id || id === user?.id;
  const profileId = id || user?.id;

  // States quản lý dữ liệu
  const [displayName, setDisplayName] = useState(user?.displayName || user?.userName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  // Trạng thái UI
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  
  // State cho Popup Verify Artist
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Nếu lỡ rớt vào trang này mà mất token
  if (!user) {
    return <div className="text-spotify-subtext p-6">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  // Chức năng: Copy ID
  const handleCopyId = () => {
    if (profileId) {
      navigator.clipboard.writeText(profileId);
      toast.success("Đã sao chép ID vào khay nhớ tạm!");
    }
  };

  // Chức năng: Upload Ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
          setIsUploading(true);
          const response = await fetch('http://localhost:5277/api/media/upload-image', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              body: formData
          });

          const result = await response.json();
          if (result.success) {
              setAvatarUrl(result.data);
              toast.success("Tải ảnh lên thành công!");
          } else {
              toast.error(result.message || "Lỗi khi upload ảnh!");
          }
      } catch (error) {
          toast.error("Không thể kết nối đến server!");
      } finally {
          setIsUploading(false);
      }
  };

  // Chức năng: Lưu thay đổi Profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.put('/auth/profile', {
          displayName,
          bio,
          avatarUrl,
        });

        toast.success("Cập nhật Hồ sơ thành công!");
        updateUser?.({ displayName, bio, avatarUrl });
        setIsEditingName(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra, không thể cập nhật.");
      }
  };

  // Chức năng: Verify Artist
  const submitVerifyArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassword) {
      toast.warning("Vui lòng nhập mật khẩu!"); return;
    }
    
    setIsVerifying(true);
    try {
      const res = await api.post('/auth/verify-artist', { password: verifyPassword });
      if (res.data.success) {
        toast.success("Tuyệt vời! Bạn đã trở thành Nghệ sĩ 🎉");
        updateUser?.({ isArtist: true });
        setShowVerifyModal(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mật khẩu không đúng hoặc có lỗi xảy ra!");
    } finally {
      setIsVerifying(false);
      setVerifyPassword('');
    }
  };

  return (
    <div className="text-spotify-text max-w-4xl mx-auto mt-4 pb-24 relative">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8 pb-8 border-b border-spotify-highlight">
        {/* Khối Avatar */}
        <div className="w-48 h-48 bg-spotify-highlight rounded-full overflow-hidden flex items-center justify-center text-7xl font-bold shadow-2xl relative group">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            user.userName?.charAt(0).toUpperCase() || 'U'
          )}
          {/* Lớp phủ mờ khi hover để đổi ảnh (Chỉ hiện nếu là My Profile) */}
          {isMyProfile && (
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-sm font-semibold">{isUploading ? 'Đang tải...' : 'Đổi ảnh'}</span>
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          )}
        </div>

        {/* Khối Thông tin Name */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider mb-2">
            {user?.isArtist ? (
              <span className="flex items-center gap-1 text-[#1ed760]"><FiCheckCircle /> NGHỆ SĨ XÁC MINH</span>
            ) : (
              <span className="uppercase text-spotify-subtext">Hồ sơ</span>
            )}
            
            {/* Nút Verify Artist (Chỉ mình mới thấy và nếu chưa là Artist) */}
            {isMyProfile && !user?.isArtist && (
              <button 
                onClick={() => setShowVerifyModal(true)}
                className="ml-4 flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs transition"
              >
                <FiStar /> Nâng cấp Nghệ sĩ
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 group">
            {isEditingName && isMyProfile ? (
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-5xl font-black bg-[#282828] border-b-2 border-[#1ed760] focus:outline-none p-2 w-full"
                autoFocus
                onBlur={() => setIsEditingName(false)} // Click ra ngoài tự đóng
              />
            ) : (
              <h1 className="text-6xl font-black mb-1">{displayName}</h1>
            )}
            
            {isMyProfile && !isEditingName && (
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 text-spotify-subtext hover:text-white p-2">
                <FiEdit2 size={24} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 text-spotify-subtext text-sm">
            <span>@{user.userName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-white transition" title="Sao chép ID" onClick={handleCopyId}>
              ID: {profileId?.substring(0, 8)}... <FiCopy />
            </span>
          </div>

          {/* NÚT FOLLOW DÀNH CHO PROFILE NGƯỜI KHÁC */}
          {!isMyProfile && profileId && (
            <div className="mt-6">
              <FollowButton targetId={profileId} />
            </div>
          )}
        </div>
      </div>

      {/* CHỈ CHO PHÉP SỬA BIO KHI LÀ MY PROFILE */}
      {isMyProfile ? (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-spotify-subtext mb-2">Giới thiệu bản thân (Tiểu sử)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 bg-[#242424]/50 border border-transparent rounded-xl text-spotify-text focus:outline-none focus:border-spotify-subtext transition-colors min-h-[120px] resize-none"
              placeholder="Thêm đôi nét về bạn..."
            />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
              Lưu hồ sơ
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
          <p className="text-spotify-subtext">{bio || "Người dùng này chưa có tiểu sử."}</p>
        </div>
      )}

      {/* POPUP XÁC THỰC NGHỆ SĨ */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-[#242424] p-8 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1ed760]/20 text-[#1ed760] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <FiStar />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Xác nhận Nghệ sĩ</h2>
              <p className="text-spotify-subtext text-sm">Vui lòng nhập mật khẩu để xác nhận mở khóa quyền đăng tải tác phẩm.</p>
            </div>
            
            <form onSubmit={submitVerifyArtist} className="space-y-4">
              <input
                type="password"
                placeholder="Mật khẩu của bạn..."
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="w-full bg-black/50 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1ed760]"
                required
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowVerifyModal(false)} className="flex-1 py-3 font-bold text-white bg-white/5 rounded-full hover:bg-white/10">
                  Hủy
                </button>
                <button type="submit" disabled={isVerifying} className="flex-1 py-3 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition disabled:opacity-50">
                  {isVerifying ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;