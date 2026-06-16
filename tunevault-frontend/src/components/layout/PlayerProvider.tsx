import { useState, type ReactNode } from 'react';
import type { MediaItem } from '../../types';
import { PlayerContext } from '../../contexts/PlayerContext';
import { playerService } from '../../services/playerService';

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ---> BỔ SUNG CHO HIẾU: State quản lý Queue <---
  const [queue, setQueueState] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const playTrack = async (track: MediaItem) => {
    try {
      setIsLoading(true);
      setCurrentTrack(track);

      const url = await playerService.getStreamUrl(track.id);
      setStreamUrl(url);
    } catch (error) {
      console.error('Gặp sự cố khi thiết lập luồng streaming bài hát:', error);
      setStreamUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  // ---> BỔ SUNG CHO HIẾU: Các hàm điều khiển Queue <---
  const setQueue = async (tracks: MediaItem[], startIndex: number = 0) => {
    if (tracks.length > 0) {
      setQueueState(tracks);
      setCurrentIndex(startIndex);
      await playTrack(tracks[startIndex]);
    }
  };

  const playNext = async () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      await playTrack(queue[nextIndex]);
    }
  };

  const playPrev = async () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      await playTrack(queue[prevIndex]);
    }
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, streamUrl, isLoading, playTrack,
      queue, currentIndex, setQueue, playNext, playPrev // Cung cấp ra ngoài
    }}>
      {children}
    </PlayerContext.Provider>
  );
};