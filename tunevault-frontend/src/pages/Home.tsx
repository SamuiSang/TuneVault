import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import FollowButton from '../components/layout/FollowButton';
import { interactionService, type MediaItemDto } from '../services/interactionService';

const Home = () => {
  // ---> BỔ SUNG CHO HIẾU: Dùng setQueue thay cho playTrack <---
  const { setQueue } = usePlayer();
  
  // Quản lý trạng thái danh sách bài hát lấy từ API thật
  const [listeningHistory, setListeningHistory] = useState<MediaItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gọi API lấy lịch sử nghe nhạc gần đây khi vừa vào Trang chủ
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const data = await interactionService.getListeningHistory();
        setListeningHistory(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ từ API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <p className="animate-pulse">Đang tải danh sách phát...</p>
      </div>
    );
  }

  return (
    <div className="text-spotify-text pb-24">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Nghe gần đây
        </h2>
        
        {listeningHistory.length === 0 ? (
          <p className="text-spotify-subtext text-sm italic">Bạn chưa nghe bài hát nào gần đây.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
            {/* ---> BỔ SUNG CHO HIẾU: Bắt thêm index trong vòng map <--- */}
            {listeningHistory.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => {
                  // Ép kiểu mảng data thô từ API thành MediaItem chuẩn và ném nguyên cụm vào Queue
                  const queueTracks = listeningHistory.map(track => ({
                    id: track.id,
                    title: track.title,
                    artistName: track.artistName,
                    thumbnailUrl: track.coverImageUrl || '',
                    filePath: track.filePath
                  } as any));
                  
                  // Bắt đầu phát Queue từ vị trí index bài hát được click
                  setQueue(queueTracks, index);
                }} 
                className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer relative"
              >
                {/* Vùng chứa ảnh bìa */}
                <div className="relative mb-4">
                  <img 
                    src={item.coverImageUrl || 'default-cover.png'} 
                    alt={item.title} 
                    className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                  />
                  
                  {/* Nút Play bài hát */}
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                    <FaPlay className="ml-1 text-lg" />
                  </button>
                </div>

                {/* Thông tin bài hát */}
                <h3 className="font-bold text-base mb-1 truncate" title={item.title}>
                  {item.title}
                </h3>
                
                {/* Khu vực Tên nghệ sĩ & Nút Follow tương tác */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-spotify-subtext truncate max-w-[60%]">
                    {item.artistName}
                  </p>
                  
                  {/* Ngăn chặn sự kiện click thẻ khi bấm nút Follow */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FollowButton targetId={item.id} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;