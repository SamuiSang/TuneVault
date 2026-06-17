import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Topbar = () => {
  // Khởi tạo hook điều hướng và Auth
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  // State quản lý việc đóng/mở Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Lắng nghe sự kiện click chuột để tự động đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-spotify-base flex items-center justify-between px-6 sticky top-0 z-10">
      {/* ---> GO FOWARD / GO BACK <--- */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-spotify-subtext cursor-not-allowed">
          &lt;
        </button>
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-spotify-subtext cursor-not-allowed">
          &gt;
        </button>
      </div>
      {/* ---> GO FOWARD / GO BACK <--- */}

      {/* --->  NÚT ĐĂNG NHẬP ĐĂNG KÝ HOẶC THÔNG TIN USER <--- */}
      <div className="flex items-center gap-4 text-spotify-text text-sm font-bold">
        {isAuthenticated ? (
          // HIỆN THỊ KHI ĐÃ ĐĂNG NHẬP (AVATAR + DROPDOWN)
          <div className="relative" ref={dropdownRef}>
            <button //AVATAR NGƯỜI DÙNG
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold hover:scale-105 transition-transform ${user?.avatarUrl ? 'bg-transparent' : 'bg-pink-500 text-black'}`}
              title={user?.userName}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.userName?.charAt(0).toUpperCase() || 'U'
              )}
            </button>

            {isDropdownOpen && ( //DROP DOWN KIỂU SPOTIFY
              <div className="absolute right-0 mt-2 w-48 bg-spotify-elevated rounded shadow-2xl py-1 z-50 text-spotify-text text-sm font-medium">
                <button  //HỒ SƠ
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                >
                  Hồ sơ
                </button>
                <button // SETTING
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // navigate('/settings'); (Nếu sau này bạn có làm trang cài đặt)
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                >
                  Cài đặt
                </button>
                
                <div className="border-t border-spotify-highlight my-1"></div> {/*A LINES */}
                
                <button //LOGOUT 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          // Hiển thị (đăng ký / đăng nhập) khi CHƯA ĐĂNG NHẬP
          <>
            <button 
              onClick={() => navigate('/auth' , {state: {isLogin: false}})} 
              className="hover:scale-105 transition-transform text-spotify-subtext hover:text-white"
            >
              Đăng ký
            </button>
            <button 
              onClick={() => navigate('/auth' , {state: {isLogin: true}} )} 
              className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Đăng nhập
            </button>
          </>
        )}
      </div>
       {/* ---> NÚT ĐĂNG NHẬP ĐĂNG KÝ HOẶC THÔNG TIN USER <--- */}
    </header>
  );
};

export default Topbar;