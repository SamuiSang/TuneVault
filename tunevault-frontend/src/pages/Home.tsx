import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import { mediaService } from '../services/mediaService';
import type { MediaItem } from '../types';
import { useNavigate } from 'react-router-dom'; // ---> THÊM IMPORT: Để chuyển hướng trang

const Home = () => {
  const { setQueue } = usePlayer();
  const navigate = useNavigate(); // ---> KHỞI TẠO: Hook điều hướng điều hướng đường dẫn

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const data = await mediaService.getAllMedia();
        setMediaItems(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài hát:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // ---> THÊM HÀM XỬ LÝ CLICK PHÂN LOẠI MEDIA
  // Tình trạng: Đề bài yêu cầu Video có view riêng, không dùng chung Audio Bar.
  // Hành động: Khi người dùng click vào Media có type === "Video", frontend chuyển hướng sang route riêng biệt.
  const handleMediaClick = (item: MediaItem) => {
    if (item.type === 'Video') {
      // Nếu là Video: Điều hướng trực tiếp sang route chuyên dụng (/video/:id) kèm dữ liệu state
      navigate(`/video/${item.id}`, { state: { videoData: item } });
    } else {
      // Nếu là Audio: Giữ nguyên logic phát nhạc đẩy bài hát vào Queue của Audio Bar như cũ
      setQueue([item]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <p className="animate-pulse">Đang tải danh sách bài hát...</p>
      </div>
    );
  }

  return (
    <div className="text-spotify-text pb-24">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">Dành cho bạn</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMediaClick(item)} // ---> THAY ĐỔI: Sử dụng hàm handleMediaClick phân loại thay vì setQueue trực tiếp
              className="bg-spotify-card hover:bg-spotify-card-hover p-3 rounded-md transition-all duration-300 cursor-pointer group relative"
            >
              <div className="relative group mb-4">
                <img 
                  src={item.thumbnailUrl || item.thumbnailUrl || 'default-cover.png'} 
                  alt={item.title} 
                  className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                />
                
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                  <FaPlay className="ml-1 text-lg" />
                </button>
              </div>

              {/* Sửa text-base thành text-sm và font-bold thành font-semibold để chữ title nhỏ lại và thanh lịch hơn */}
              <h3 className="font-medium text-[13px] mb-1.5 line-clamp-2" title={item.title}>
                {item.title}
              </h3>
              
              <div className="flex items-center justify-between mt-1">
                {/* Đổi max-w-[60%] thành w-full để tên Artist hiển thị rộng rãi, tận dụng khoảng trống sau khi xóa nút follow */}
                <p className="text-xs text-spotify-subtext truncate w-full">
                  {item.ownerId || 'Unknown Artist'}
                </p>
                {/* ĐÃ XÓA: Phần chứa FollowButton ở đây để đưa về đúng thiết kế chuẩn hệ thống */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;