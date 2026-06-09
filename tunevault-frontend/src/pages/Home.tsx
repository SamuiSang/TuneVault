import { mockMediaItems } from '../utils/mockData';
import { FaPlay } from 'react-icons/fa';
// Thêm import usePlayer
import { usePlayer } from '../contexts/PlayerContext';

const Home = () => {
  const { playTrack } = usePlayer(); // Lấy hàm playTrack từ context

  return (
    <div className="text-spotify-text pb-24">
      {/* Khối Gợi Ý */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Dành Cho Bạn
        </h2>
        
        {/* Lưới hiển thị danh sách bài hát */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockMediaItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => playTrack(item)} // Gọi hàm khi click vào thẻ
              className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer"
            >
              {/* Vùng chứa ảnh bìa */}
              <div className="relative mb-4">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full aspect-square object-cover rounded-md shadow-lg"
                />
                
                {/* Nút Play ẩn/hiện khi hover */}
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-green-400 text-black">
                  <FaPlay className="ml-1 text-xl" />
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
      </section>

      {/* Có thể copy thêm các khối <section> khác như "Nghe Gần Đây", "Playlist Nổi Bật" */}
    </div>
  );
};

export default Home;