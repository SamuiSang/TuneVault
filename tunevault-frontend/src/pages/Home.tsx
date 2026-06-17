import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import FollowButton from '../components/layout/FollowButton';
import { mediaService } from '../services/mediaService';
import type { MediaItem } from '../types';

const Home = () => {
  const { setQueue } = usePlayer();

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
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">
          Danh sách bài hát
        </h2>
        
        {mediaItems.length === 0 ? (
          <p className="text-spotify-subtext text-sm italic">Hiện chưa có bài hát nào trong kho.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
            {mediaItems.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => {
                  //Dùng ...track để giữ lại toàn bộ các thuộc tính bắt buộc (type, duration, ownerId)
                  const queueTracks = mediaItems.map(track => ({
                    ...track, 
                    artistName: track.ownerId || 'Unknown Artist',
                    thumbnailUrl: track.thumbnailUrl || 'default-cover.png',
                  })); // <-- Không cần dùng "as MediaItem" nữa vì TypeScript đã tự nhận diện

                  setQueue(queueTracks, index);
                }}
                className="bg-spotify-base p-4 rounded-md hover:bg-spotify-highlight transition-all duration-300 group cursor-pointer relative"
              >
                <div className="relative mb-4">
                  <img 
                    src={item.thumbnailUrl || 'default-cover.png'} 
                    alt={item.title} 
                    className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                  />
                  
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                    <FaPlay className="ml-1 text-lg" />
                  </button>
                </div>

                <h3 className="font-bold text-base mb-1 truncate" title={item.title}>
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-spotify-subtext truncate max-w-[60%]">
                    {item.ownerId || 'Unknown Artist'}
                  </p>
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FollowButton targetId={item.ownerId} />
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