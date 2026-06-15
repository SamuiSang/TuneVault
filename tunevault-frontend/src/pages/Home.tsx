import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import api from '../services/api';
import type { MediaItem } from '../types';

interface MediaItemDto {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  filePath: string;
  type: string;
}

// ---> ĐÂY LÀ PHẦN TRANG CHỦ HOME (LỊCH SỬ & TƯƠNG TÁC) <---
const Home = () => {
  const { playTrack } = usePlayer();
  const [historySongs, setHistorySongs] = useState<MediaItemDto[]>([]);
  const [likedSongs, setLikedSongs] = useState<MediaItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [historyRes, likedRes] = await Promise.all([
          api.get('/api/interactions/history'),
          api.get('/api/interactions/liked-songs')
        ]);
        
        setHistorySongs(historyRes.data);
        setLikedSongs(likedRes.data);
      } catch (error) {
        console.error("Lỗi khi kết nối API trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <div className="animate-pulse font-semibold text-lg">Đang tải dữ liệu trang chủ...</div>
      </div>
    );
  }

  // Hàm helper để convert DTO từ API sang định dạng MediaItem của Player
  const handlePlayTrack = (item: MediaItemDto) => {
    const trackToPlay: MediaItem = {
      id: item.id,
      title: item.title,
      thumbnailUrl: item.coverImageUrl,
      type: (item.type as 'Audio' | 'Video') || 'Audio',
      duration: 0, // Backend hiện chưa trả về duration trong DTO này, gán tạm 0
      filePath: item.filePath,
      ownerId: item.artistName // Tạm dùng artistName map vào ownerId để UI hiển thị
    };
    playTrack(trackToPlay);
  };

  return (
    <div className="text-spotify-text pb-24 space-y-12">
      {/* KHU VỰC 1: LỊCH SỬ NGHE GẦN ĐÂY */}
      <section>
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Nghe gần đây
        </h2>
        {historySongs.length === 0 ? (
          <p className="text-sm text-spotify-subtext italic">Bạn chưa nghe bài hát nào gần đây.</p>
        ) : (
          <>
            {/* ---> ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
            {/* Dùng auto-fill và minmax(150px, 1fr) để item luôn to rõ và tự động xuống hàng */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
              {historySongs.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handlePlayTrack(item)}
                  className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer"
                >
                  {/* Vùng chứa ảnh bìa */}
                  <div className="relative mb-4">
                    {/* Thêm bg-spotify-elevated để lấp chỗ trống nếu ảnh bị lỗi/trong suốt, object-center để canh giữa ảnh */}
                    <img 
                      src={item.coverImageUrl || '/default-cover.png'} 
                      alt={item.title} 
                      className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                    />
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                      <FaPlay className="ml-1 text-lg" />
                    </button>
                  </div>

                  {/* Thông tin bài hát */}
                  <h3 className="font-bold text-base mb-1 truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-spotify-subtext truncate">
                    {item.artistName}
                  </p>
                </div>
              ))}
            </div>
            {/* ---> END: ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
          </>
        )}
      </section>

      {/* KHU VỰC 2: TƯƠNG TÁC - BÀI HÁT ĐÃ THÍCH */}
      <section>
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Bài hát đã thích
        </h2>
        {likedSongs.length === 0 ? (
          <p className="text-sm text-spotify-subtext italic">Hãy bấm ❤️ các bài hát bạn yêu thích để lưu trữ ở đây nhé.</p>
        ) : (
          <>
            {/* ---> ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
            {/* Dùng auto-fill và minmax(150px, 1fr) để item luôn to rõ và tự động xuống hàng */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
              {likedSongs.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handlePlayTrack(item)}
                  className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer"
                >
                  {/* Vùng chứa ảnh bìa */}
                  <div className="relative mb-4">
                    {/* Thêm bg-spotify-elevated để lấp chỗ trống nếu ảnh bị lỗi/trong suốt, object-center để canh giữa ảnh */}
                    <img 
                      src={item.coverImageUrl || '/default-cover.png'} 
                      alt={item.title} 
                      className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                    />
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                      <FaPlay className="ml-1 text-lg" />
                    </button>
                  </div>

                  {/* Thông tin bài hát */}
                  <h3 className="font-bold text-base mb-1 truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-spotify-subtext truncate">
                    {item.artistName}
                  </p>
                </div>
              ))}
            </div>
            {/* ---> END: ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
// ---> END: ĐÂY LÀ PHẦN TRANG CHỦ HOME (LỊCH SỬ & TƯƠNG TÁC) <---