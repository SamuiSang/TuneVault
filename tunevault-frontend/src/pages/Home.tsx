import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import { mediaService } from '../services/mediaService';
import type { MediaItem } from '../types';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { setQueue } = usePlayer();
  const navigate = useNavigate();

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

  const handleMediaClick = (item: MediaItem) => {
    if (item.type === 'Video') {
      navigate(`/video/${item.id}`, { state: { videoData: item } });
    } else {
      setQueue([item]);
    }
  };

  const handleArtistClick = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    if (artistId) {
      navigate(`/artist/${artistId}`);
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
              onClick={() => handleMediaClick(item)}
              className="bg-spotify-card hover:bg-spotify-card-hover p-3 rounded-md transition-all duration-300 cursor-pointer group relative"
            >
              <div className="relative group mb-4">
                <img
                  src={item.thumbnailUrl || 'default-cover.png'}
                  alt={item.title}
                  className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
                />

                <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:scale-105 text-black z-10">
                  <FaPlay className="ml-1 text-lg" />
                </button>
              </div>

              <h3 className="font-medium text-[13px] mb-1.5 line-clamp-2" title={item.title}>
                {item.title}
              </h3>

              <div className="flex items-center justify-between mt-1">
                <p 
                  onClick={(e) => handleArtistClick(e, item.ownerId)}
                  className="text-xs text-spotify-subtext truncate w-full hover:underline hover:text-white transition-colors cursor-pointer"
                >
                  {item.ownerId || 'Unknown Artist'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;