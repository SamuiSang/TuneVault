import { mockMediaItems } from '../utils/mockData';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';

// ---> ĐÂY LÀ PHẦN TRANG CHỦ HOME (LỊCH SỬ & TƯƠNG TÁC) <---
const Home = () => {
  const { playTrack } = usePlayer();

  return (
    <div className="text-spotify-text pb-24">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Dành Cho Bạn
        </h2>
        
        {/* ---> ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
        {/* Dùng auto-fill và minmax(200px, 1fr) để item luôn to rõ và tự động xuống hàng */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
          {mockMediaItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => playTrack(item)}
              className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer"
            >
              {/* Vùng chứa ảnh bìa */}
              <div className="relative mb-4">
                {/* Thêm bg-spotify-elevated để lấp chỗ trống nếu ảnh bị lỗi/trong suốt, object-center để canh giữa ảnh */}
                <img 
                  src={item.thumbnailUrl} 
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
                {item.type === 'Audio' ? 'Bài hát' : 'Video'}
              </p>
            </div>
          ))}
        </div>
        {/* ---> END: ĐÂY LÀ PHẦN LƯỚI BÀI HÁT (ĐÃ LÀM TO ITEM) <--- */}
      </section>
    </div>
  );
};

export default Home;
// ---> END: ĐÂY LÀ PHẦN TRANG CHỦ HOME (LỊCH SỬ & TƯƠNG TÁC) <---