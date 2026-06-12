import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiInbox, FiPlus } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';

// ---> ĐÂY LÀ PHẦN SIDEBAR TRÁI (CHIA 2 BOX) <---
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-white" : "text-spotify-subtext";

  return (
    <>
      {/* ---> ĐÂY LÀ BOX 1: ĐIỀU HƯỚNG CHÍNH <--- */}
      <div className="bg-spotify-base rounded-lg p-5 flex flex-col gap-5">
        <Link to="/" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/')}`}>
          <FiHome className="text-[28px]" /> Trang chủ
        </Link>

        {/* // Thay đổi của Hiếu: Sắp xếp lại vị trí Tìm kiếm và sửa lỗi đóng/mở thẻ lồng nhau */}
        <Link to="/search" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/search')}`}>
          <FiSearch className="text-[28px]" /> Tìm kiếm
        </Link>

        <Link to="/library" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <BiLibrary className="text-2xl" /> Thư viện
        </Link>
        
        {/* chiến mới thêm */}
        {/* // Thay đổi của Hiếu: Giữ lại mục Hộp thư và cấu trúc lại thẻ bao bọc hợp lệ */}
        <Link to="/share-inbox" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <FiInbox className="text-2xl" /> Hộp thư
        </Link>
      </div>
      {/* ---> END: ĐÂY LÀ BOX 1: ĐIỀU HƯỚNG CHÍNH <--- */}

      {/* ---> ĐÂY LÀ BOX 2: THƯ VIỆN & PLAYLIST <--- */}
      <div className="bg-spotify-base rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Header Thư viện */}
        <div className="p-4 flex items-center justify-between text-spotify-subtext font-bold shadow-sm z-10">
          <Link to="/library" className={`flex items-center gap-3 hover:text-white transition-colors ${isActive('/library')}`}>
            <BiLibrary className="text-[28px]" /> Thư viện
          </Link>
          <button className="hover:text-white hover:bg-spotify-highlight p-2 rounded-full transition-colors" title="Tạo playlist mới">
            <FiPlus className="text-xl" />
          </button>
        </div>

        {/* Nội dung thư viện cuộn được */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
          
          {/* Nút Bài hát đã thích */}
          <div className="flex items-center gap-3 p-2 hover:bg-spotify-highlight rounded-md cursor-pointer transition-colors group mb-2">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-300 text-white rounded shadow-sm">
              <FaHeart className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">Bài hát đã thích</span>
              <span className="text-sm text-spotify-subtext">Danh sách phát • 168 bài hát</span>
            </div>
          </div>

          {/* Danh sách Playlist giả định */}
          <ul className="flex flex-col">
            {[1, 2, 3].map((item) => (
              <li key={item} className="flex items-center gap-3 p-2 hover:bg-spotify-highlight rounded-md cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-spotify-elevated rounded flex-shrink-0 flex items-center justify-center text-spotify-subtext">
                  ♪
                </div>
                {/* // Thay đổi của Hiếu: Sửa lỗi thẻ đóng /li sang /div ở cuối khối map này */}
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-white truncate">Playlist #{item}</span>
                  <span className="text-sm text-spotify-subtext truncate">Danh sách phát • TuneVault</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* ---> END: ĐÂY LÀ BOX 2: THƯ VIỆN & PLAYLIST <--- */}
    </>
  );
};

export default Sidebar;
// ---> END: ĐÂY LÀ PHẦN SIDEBAR TRÁI (CHIA 2 BOX) <---