import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiInbox } from 'react-icons/fi'; // Thêm FiInbox ở đây
import { BiLibrary } from 'react-icons/bi';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-black flex flex-col p-6 h-full">
      {/* Logo Placeholder */}
      <div className="text-spotify-text text-2xl font-bold mb-8">
        TuneVault
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 text-spotify-subtext font-semibold">
        <Link to="/" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <FiHome className="text-2xl" />
          Trang chủ
        </Link>
        <Link to="/search" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <FiSearch className="text-2xl" />
          Tìm kiếm
        </Link>
        <Link to="/library" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <BiLibrary className="text-2xl" />
          Thư viện
        </Link>
        
        {/* chiến mới thêm */}
        <Link to="/share-inbox" className="flex items-center gap-4 hover:text-spotify-text transition-colors">
          <FiInbox className="text-2xl" />
          Hộp thư
        </Link>
      </nav>

      {/* Playlist Section Placeholder */}
      <div className="mt-8 pt-4 border-t border-spotify-elevated flex-1 overflow-y-auto">
        <p className="text-sm text-spotify-subtext mb-4">Playlist của bạn</p>
        <ul className="flex flex-col gap-2 text-spotify-subtext text-sm">
          <li className="hover:text-spotify-text cursor-pointer">Nhạc Chill</li>
          <li className="hover:text-spotify-text cursor-pointer">Lofi Coding</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;