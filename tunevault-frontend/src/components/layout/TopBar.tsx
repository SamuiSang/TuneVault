import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiSearch, FiInbox, FiBell } from 'react-icons/fi';
import {
  getUnreadNotifications,
  markAllNotificationsAsRead,
} from '../../services/notificationService';

const Topbar = () => {
  // Khởi tạo hook điều hướng và Auth
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  
  // State quản lý việc đóng/mở Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // -----> BADGE SỐ LƯỢNG THÔNG BÁO CHƯA ĐỌC <-----
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Gọi API lấy số lượng thông báo chưa đọc mỗi khi user thay đổi (login/logout)
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }
    const fetchUnreadCount = async () => {
      try {
        const unread = await getUnreadNotifications(user.id);
        setUnreadCount(unread.length);
      } catch {
        // Không làm gì nếu lỗi (user chưa có thông báo)
      }
    };
    void fetchUnreadCount();
  }, [user?.id]);

  // Khi user click chuông: đánh dấu tất cả đã đọc và reset badge về 0
  const handleBellClick = async () => {
    if (!user?.id || unreadCount === 0) return;
    setUnreadCount(0); // Cập nhật UI ngay lập tức (optimistic update)
    try {
      await markAllNotificationsAsRead(user.id);
    } catch {
      // Nếu lỗi, có thể fetch lại để đồng bộ
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="h-16 bg-spotify-base flex items-center justify-between px-6 sticky top-0 z-10 gap-4">
      {/* ---> LEFT PORTION: HOME & SEARCH <--- */}
      <div className="flex items-center gap-2 flex-1 max-w-2xl">
        {/* Nút Home */}
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-[#1F1F1F] hover:bg-[#2A2A2A] flex items-center justify-center text-spotify-subtext hover:text-white transition-colors flex-shrink-0"
          title="Home"
        >
          <FiHome className="text-[24px]" />
        </button>

        {/* Thanh Search */}
        <div 
          onClick={() => {
            if (location.pathname !== '/search') {
              navigate('/search');
            }
          }}
          className="flex-1 flex items-center bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:ring-1 hover:ring-white/20 focus-within:ring-2 focus-within:ring-white focus-within:bg-[#2A2A2A] rounded-full h-12 px-3 transition-all cursor-text"
        >
          <FiSearch className="text-spotify-subtext hover:text-white text-[24px] ml-1 mr-3 flex-shrink-0 cursor-pointer" />
          <input 
            type="text" 
            value={searchParams.get('q') || ''}
            onChange={handleSearchChange}
            placeholder="What do you want to play?" 
            className="bg-transparent border-none outline-none text-white w-full placeholder-spotify-subtext font-medium text-base h-full"
          />
          <div className="border-l border-white/20 pl-3 ml-2 flex items-center h-6 flex-shrink-0">
             <FiInbox className="text-spotify-subtext hover:text-white text-xl cursor-pointer" title="Browse" />
          </div>
        </div>
      </div>

      {/* --->  NÚT ĐĂNG NHẬP ĐĂNG KÝ HOẶC THÔNG TIN USER <--- */}
      <div className="flex items-center gap-4 text-spotify-text text-sm font-bold">
        {isAuthenticated ? (
          // HIỆN THỊ KHI ĐÃ ĐĂNG NHẬP (ICON CHUÔNG + AVATAR + DROPDOWN)
          <>
            {/* -----> ICON CHUÔNG VỚI BADGE <----- */}
            <button
              onClick={handleBellClick}
              title="Thông báo"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-all"
            >
              <FiBell className="text-[20px]" />
              {/* Badge chỉ hiện khi có thông báo chưa đọc */}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-[3px] leading-none animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

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
          </> // đóng fragment của phần đã đăng nhập
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