import { useEffect, useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { mediaService } from '../../services/mediaService';
import { formatDuration } from '../../utils/mediaHelpers';
import type { MediaItem } from '../../types';

const NowPlayingPanel = () => {
  const { currentTrack } = usePlayer();
  const [details, setDetails] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!currentTrack?.id) {
        setDetails(null);
        return;
      }

      setLoading(true);
      try {
        const data = await mediaService.getMediaById(currentTrack.id);
        setDetails(data);
      } catch (error) {
        console.error('Không thể tải chi tiết bài hát:', error);
        setDetails(currentTrack);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [currentTrack]);

  if (!currentTrack) {
    return (
      <div className="text-center text-spotify-subtext text-sm mt-10">
        Chi tiết bài hát & nghệ sĩ sẽ hiển thị ở đây khi bạn chọn bài...
      </div>
    );
  }

  const display = details ?? currentTrack;

  return (
    <div className="space-y-4">
      <img
        src={display.thumbnailUrl || 'default-cover.png'}
        alt={display.title}
        className="w-full aspect-square object-cover rounded-lg shadow-lg"
      />

      <div>
        <p className="text-xs uppercase tracking-wider text-spotify-subtext mb-1">Đang phát</p>
        <h4 className="text-lg font-bold leading-tight">{display.title}</h4>
        <p className="text-sm text-spotify-subtext mt-1">{display.ownerId || 'Unknown Artist'}</p>
      </div>

      {loading ? (
        <p className="text-xs text-spotify-subtext animate-pulse">Đang tải thông tin...</p>
      ) : (
        <div className="space-y-2 text-sm text-spotify-subtext">
          <p>
            <span className="text-white font-medium">Loại:</span> {display.type}
          </p>
          <p>
            <span className="text-white font-medium">Thời lượng:</span>{' '}
            {formatDuration(display.duration)}
          </p>
          {display.description && (
            <p className="text-xs leading-relaxed line-clamp-4">{display.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NowPlayingPanel;
