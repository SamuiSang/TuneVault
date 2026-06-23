import { useEffect, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { mediaService } from '../services/mediaService';
import { FaPlay } from 'react-icons/fa';
import type { MediaItem } from '../types';

const AllTracks = () => {
  const { currentTrack, setQueue } = usePlayer();
  
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTracks = async () => {
      try {
        const res = await mediaService.getAllMedia();
        setTracks(res.filter((item: any) => item.type !== 'Video'));
      } catch (err) {
        console.error('Error fetching tracks:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllTracks();
  }, []);

  const handlePlayTrack = (track: MediaItem) => {
    setQueue([track, ...tracks.filter((t: MediaItem) => t.id !== track.id)]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <p className="animate-pulse">Đang tải lịch sử nghe nhạc...</p>
      </div>
    );
  }

  return (
    <div className="text-spotify-text pb-24 px-4 pt-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Tất cả bài hát</h1>
      
      {tracks.length === 0 ? (
        <div className="text-center text-spotify-subtext mt-10">
          <p>Không có bài hát nào.</p>
        </div>
      ) : (
        <div className="space-y-2">
            {tracks.map((track: MediaItem, index: number) => (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer group transition-all ${currentTrack?.id === track.id ? 'bg-zinc-800' : 'hover:bg-neutral-800'}`}
              >
                <div className="flex items-center gap-4 w-[60%]">
                  <span className="text-gray-400 w-5 text-center font-medium">
                    {currentTrack?.id === track.id ? (
                      <FaPlay className="text-spotify-primary text-xs mx-auto" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <img 
                    src={track.thumbnailUrl || "default-cover.png"} 
                    alt={track.title} 
                    className="w-10 h-10 object-cover rounded shadow"
                  />
                  <div>
                    <span className={`font-medium truncate block ${currentTrack?.id === track.id ? 'text-spotify-primary' : 'text-white'}`}>{track.title}</span>
                    <span className="text-sm text-spotify-subtext block">{track.ownerName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-mono">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default AllTracks;
