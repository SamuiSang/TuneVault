import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiInbox, FiPlus, FiUploadCloud } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import CreatePlaylistModal from '../CreatePlaylistModal';

// ---> BỔ SUNG: Import API service và Auth context <---
import { getUserPlaylists } from '../../services/playlistService';
import { useAuth } from '../../contexts/AuthContext';

// ---> ĐÂY LÀ PHẦN SIDEBAR TRÁI (CHIA 2 BOX) <---
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-white" : "text-spotify-subtext";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger để tải lại playlist

  // ---> BỔ SUNG: State và logic lấy danh sách playlist <---
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { user } = useAuth(); // Lấy user từ Context

  useEffect(() => {
    const fetchPlaylists = async () => {
      // Ưu tiên lấy từ Context, dự phòng localStorage nếu Context chưa kịp update
      const userId = user?.id || localStorage.getItem('userId');

      if (!userId) return; // Chưa đăng nhập thì không gọi API

      try {
        const data = await getUserPlaylists(userId);
        setPlaylists(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi tải playlist cho Sidebar:", error);
      }
    };

    fetchPlaylists();

    const handleUpdate = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('playlist_updated', handleUpdate);
    return () => window.removeEventListener('playlist_updated', handleUpdate);
  }, [user?.id, refreshTrigger]); // Chạy lại khi user đổi hoặc khi có trigger

  return (
    <>
      {/* ---> ĐÂY LÀ BOX 1: ĐIỀU HƯỚNG CHÍNH <--- */}
      <div className="bg-spotify-base rounded-lg p-5 flex flex-col gap-5">
        <Link to="/" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/')}`}>
          <FiHome className="text-[28px]" /> Trang chủ
        </Link>


        <Link to="/library" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/library')}`}>
          <BiLibrary className="text-[28px]" /> Thư viện
        </Link>

        <Link to="/share-inbox" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/share-inbox')}`}>
          <FiInbox className="text-[28px]" /> Hộp thư
        </Link>

        <Link to="/upload" className={`flex items-center gap-4 font-bold hover:text-white transition-colors ${isActive('/upload')}`}>
          <FiUploadCloud className="text-[28px]" /> Tải nhạc lên
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
          <button onClick={() => setIsCreateModalOpen(true)} className="hover:text-white hover:bg-spotify-highlight p-2 rounded-full transition-colors" title="Tạo playlist mới">
            <FiPlus className="text-xl" />
          </button>
        </div>

        {/* Nội dung thư viện cuộn được */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">

          {/* Nút Bài hát đã thích */}
          <Link to="/favorites" className={`flex items-center gap-3 p-2 hover:bg-spotify-highlight rounded-md cursor-pointer transition-colors group mb-2 ${isActive('/favorites')}`}>
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-300 text-white rounded shadow-sm">
              <FaHeart className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className={`font-semibold ${location.pathname === '/favorites' ? 'text-white' : 'text-spotify-subtext group-hover:text-white'}`}>Bài hát đã thích</span>
              <span className="text-sm text-spotify-subtext">Danh sách phát • Tự động</span>
            </div>
          </Link>

          {/* ---> ĐÃ SỬA: Danh sách Playlist thật từ CSDL <--- */}
          <ul className="flex flex-col">
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex items-center gap-3 p-2 hover:bg-spotify-highlight rounded-md transition-colors group">

                {/* Ảnh bìa Playlist */}
                <div className="w-12 h-12 bg-spotify-elevated rounded flex-shrink-0 flex items-center justify-center text-spotify-subtext overflow-hidden shadow">
                  {playlist.coverImageUrl ? (
                    <img src={playlist.coverImageUrl} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    "♪"
                  )}
                </div>

                {/* Thông tin Playlist */}
                <div className="flex flex-col overflow-hidden w-full">
                  <Link to={`/playlist/${playlist.id}`} className="font-semibold text-white truncate hover:underline block">
                    {playlist.name}
                  </Link>
                  <span className="text-sm text-spotify-subtext truncate">
                    Danh sách phát • {playlist.totalTracks || 0} bài
                  </span>
                </div>

              </li>
            ))}
          </ul>
          {/* ---> END: Danh sách Playlist thật từ CSDL <--- */}
        </div>
      </div>
      {/* ---> END: ĐÂY LÀ BOX 2: THƯ VIỆN & PLAYLIST <--- */}

      {/* Hiển thị Modal tạo Playlist */}
      {isCreateModalOpen && (
        <CreatePlaylistModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setRefreshTrigger(prev => prev + 1); // Kích hoạt tải lại danh sách
          }}
        />
      )}
    </>
  );
};

export default Sidebar;