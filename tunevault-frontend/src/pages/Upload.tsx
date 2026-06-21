import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLock, FiStar } from 'react-icons/fi';

const Upload = () => {
  const { user } = useAuth();

  // 1. Kiểm tra đăng nhập
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-spotify-subtext">
        Vui lòng đăng nhập để sử dụng tính năng này.
      </div>
    );
  }

  // 2. PHÂN QUYỀN: Chặn User thường, yêu cầu nâng cấp Artist
  if (!user.isArtist) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-spotify-subtext shadow-lg">
          <FiLock size={40} />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Tính năng dành riêng cho Nghệ sĩ</h2>
        <p className="text-spotify-subtext max-w-md mb-8 leading-relaxed">
          Bạn cần xác nhận quyền Nghệ sĩ để có thể đăng tải, quản lý bài hát và video của riêng mình trên hệ thống TuneVault.
        </p>
        <Link 
          to={`/profile/${user.id}`} 
          className="flex items-center gap-2 bg-[#1ed760] text-black font-bold px-8 py-3.5 rounded-full hover:scale-105 hover:bg-[#1fdf64] transition-all"
        >
          <FiStar size={18} /> Đi đến Hồ sơ để Xác nhận ngay
        </Link>
      </div>
    );
  }

  // 3. KHU VỰC HIỂN THỊ KHI ĐÃ LÀ ARTIST (BẠN GIỮ NGUYÊN FORM UPLOAD CỦA BẠN Ở ĐÂY)
  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-[#181818] rounded-2xl border border-white/5 shadow-2xl">
      <h2 className="text-2xl font-black text-white mb-6">Tải lên Tác phẩm mới</h2>
      
      {/* TO DO: Dán code Form Upload (chọn file mp3/mp4, nhập tên bài hát...) 
        cũ của bạn vào bên dưới khu vực này.
      */}
      <div className="border-2 border-dashed border-white/10 rounded-xl p-16 text-center text-spotify-subtext flex flex-col items-center justify-center">
         <p>Khu vực Form Upload Media của bạn...</p>
      </div>
      
    </div>
  );
};

export default Upload;