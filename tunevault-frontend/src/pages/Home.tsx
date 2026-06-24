import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import { mediaService } from '../services/mediaService';
import type { MediaItem } from '../types';
import { useNavigate } from 'react-router-dom';
import AddTrackModal from '../components/AddTrackModal';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import FollowButton from '../components/layout/FollowButton';

const Home = () => {
  const { setQueue } = usePlayer();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [historyItems, setHistoryItems] = useState<MediaItem[]>([]);
  const [audioItems, setAudioItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const [popularArtists, setPopularArtists] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        let allMediaData: any[] = [];
        let artistsRes: any = { data: [] };

        try {
          allMediaData = await mediaService.getAllMedia();
        } catch (e) {
          console.error('Error fetching all media:', e);
        }

        try {
          artistsRes = await api.get('/Search/artists?keyword=');
        } catch (e) {
          console.error('Error fetching artists:', e);
        }
        
        const allAudio = allMediaData.filter((item: any) => item.type !== 'Video');
        const allVideo = allMediaData.filter((item: any) => item.type === 'Video');
        setAudioItems(allAudio);
        setVideoItems(allVideo);

        // 1. Fetch History
        let recentItems: MediaItem[] = [];
        if (user?.id) {
          try {
            const historyRes = await api.get(`/Interactions/history/${user.id}`);
            if (historyRes.data?.success && historyRes.data.data?.length > 0) {
              const mappedItems = historyRes.data.data.map((h: any) => ({
                id: h.mediaId, // map MediaId to id
                title: h.title,
                type: h.type,
                duration: h.duration,
                thumbnailUrl: h.thumbnailUrl,
                ownerId: h.ownerId,
                ownerName: h.ownerName
              }));
              // Lọc trùng lặp ID
              const uniqueItems: MediaItem[] = [];
              const seen = new Set();
              for (const item of mappedItems) {
                  if (!seen.has(item.id)) {
                      seen.add(item.id);
                      uniqueItems.push(item);
                  }
              }
              recentItems = uniqueItems.slice(0, 5);
            }
          } catch (e) {
            console.error('Error fetching history:', e);
          }
        }

        setHistoryItems(recentItems);

        // 3. Popular Artists
        if (artistsRes.data) {
          setPopularArtists(artistsRes.data.slice(0, 5)); // Lấy 5 nghệ sĩ phổ biến
        }

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [user]);

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
        <p className="animate-pulse">Đang tải trang chủ...</p>
      </div>
    );
  }

  // UI Component cho card nhạc (dùng chung cho For You và Artist Tracks)
  const MediaCard = ({ item }: { item: MediaItem }) => (
    <div
      onClick={() => handleMediaClick(item)}
      className="bg-spotify-card hover:bg-spotify-card-hover p-3 rounded-md transition-all duration-300 cursor-pointer group/card relative"
    >
      <div className="relative mb-4">
        <img
          src={item.thumbnailUrl || 'default-cover.png'}
          alt={item.title}
          className="w-full aspect-square object-cover object-center rounded-md shadow-md bg-spotify-elevated"
        />

        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedMediaId(item.id); setIsAddModalOpen(true); }}
          className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-black/80 hover:scale-105 z-10"
          title="Thêm vào Playlist"
        >
          +
        </button>

        <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-primary rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 text-black z-10">
          <FaPlay className="ml-1 text-lg" />
        </button>
      </div>

      <h3 className="font-bold text-[15px] mb-1.5 line-clamp-2 text-white min-h-[45px]" title={item.title}>
        {item.title}
      </h3>

      <div className="flex items-center justify-between mt-1">
        <p 
          onClick={(e) => handleArtistClick(e, item.ownerId)}
          className="text-sm text-spotify-subtext truncate w-full hover:underline hover:text-white transition-colors cursor-pointer"
        >
          {item.ownerName || item.ownerId || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="text-spotify-text pb-24 px-2">
      {/* SECTION 1: Lịch sử nghe gần đây (Chỉ hiển thị khi có lịch sử) */}
      {historyItems.length > 0 && (
        <section className="mb-10 mt-2">
          <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white">Lịch sử nghe gần đây</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {historyItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: Dành cho bạn */}
      <section className="mb-10 mt-2">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white">Dành cho bạn</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {(() => {
            const randomAudios = [...audioItems].sort(() => 0.5 - Math.random()).slice(0, 5);
            return randomAudios.map((item) => (
              <MediaCard key={item.id} item={item} />
            ));
          })()}
        </div>
      </section>

      {/* SECTION 2: Nhạc MP3 */}
      <section className="mb-10 mt-2">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white">Nhạc (MP3)</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {audioItems.slice(0, 5).map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Video MV MP4 */}
      {videoItems.length > 0 && (
        <section className="mb-10 mt-2">
          <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white">Video MV (MP4)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {videoItems.slice(0, 5).map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: Popular Artists */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white">Nghệ sĩ phổ biến</h2>
            <button 
              onClick={() => navigate('/search')}
              className="text-sm text-spotify-subtext font-bold hover:underline"
            >
              Show all
            </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="bg-spotify-card hover:bg-spotify-card-hover p-4 rounded-md transition-all duration-300 cursor-pointer group relative flex flex-col items-center text-center"
            >
              {/* Circular Avatar */}
              <div className="relative w-full aspect-square mb-4 rounded-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                <img
                  src={artist.imageUrl || artist.avatarUrl || 'default-cover.png'}
                  alt={artist.name || artist.displayName || artist.userName}
                  className="w-full h-full object-cover bg-spotify-elevated"
                />
                
                {/* Hover Follow Button - Ở chính giữa ảnh hoặc góc dưới ảnh */}
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()} 
                >
                    <FollowButton targetId={artist.id} />
                </div>
              </div>

              <h3 className="font-bold text-[16px] mb-1 line-clamp-2 text-white min-h-[48px]">
                {artist.name || artist.displayName || artist.userName}
              </h3>
              <p className="text-sm text-spotify-subtext">Artist</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Add Track */}
      {isAddModalOpen && selectedMediaId && (
        <AddTrackModal
          mediaId={selectedMediaId}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedMediaId(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;