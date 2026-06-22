import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';
import { mediaService } from '../services/mediaService';
import { searchArtists } from '../services/searchService';
import type { MediaItem } from '../types';
import type { Artist } from '../types/artist';
import ArtistFollowButton from '../components/layout/ArtistFollowButton';
import { filterAudio, shuffleItems } from '../utils/mediaHelpers';

const MediaCard = ({
  item,
  onPlay,
}: {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
}) => (
  <div
    onClick={() => onPlay(item)}
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
    <p className="text-xs text-spotify-subtext truncate w-full">{item.ownerId || 'Unknown Artist'}</p>
  </div>
);

const Home = () => {
  const { setQueue, setAllMediaItems } = usePlayer();

  const [audioItems, setAudioItems] = useState<MediaItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<MediaItem[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const [mediaData, artistData] = await Promise.all([
          mediaService.getAllMedia(),
          searchArtists(''),
        ]);

        setAllMediaItems(mediaData);

        const audioOnly = filterAudio(mediaData);
        setAudioItems(audioOnly);
        setRecommendedItems(shuffleItems(audioOnly).slice(0, 8));
        setArtists(artistData as Artist[]);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài hát:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [setAllMediaItems]);

  const handleAudioPlay = (item: MediaItem) => {
    const shuffledQueue = shuffleItems(audioItems);
    const startIndex = shuffledQueue.findIndex((track) => track.id === item.id);
    setQueue(shuffledQueue, startIndex >= 0 ? startIndex : 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <p className="animate-pulse">Đang tải danh sách bài hát...</p>
      </div>
    );
  }

  return (
    <div className="text-spotify-text pb-24 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">Gợi ý cho bạn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {recommendedItems.map((item) => (
            <MediaCard key={`rec-${item.id}`} item={item} onPlay={handleAudioPlay} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">Nghệ sĩ nổi bật</h2>
        {artists.length === 0 ? (
          <p className="text-spotify-subtext text-sm">Chưa có nghệ sĩ nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-spotify-card hover:bg-spotify-card-hover p-4 rounded-md transition-all duration-300 group text-center"
              >
                <div className="relative mx-auto mb-4 w-full max-w-[160px]">
                  <img
                    src={artist.imageUrl || 'default-cover.png'}
                    alt={artist.name}
                    className="w-full aspect-square object-cover rounded-full shadow-md bg-spotify-elevated mx-auto"
                  />
                  <div className="mt-3 flex justify-center">
                    <ArtistFollowButton artistId={artist.id} compact />
                  </div>
                </div>
                <h3 className="font-semibold text-sm truncate">{artist.name}</h3>
                <p className="text-xs text-spotify-subtext mt-1">{artist.totalTracks} bài hát</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer">Dành cho bạn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {audioItems.map((item) => (
            <MediaCard key={item.id} item={item} onPlay={handleAudioPlay} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
