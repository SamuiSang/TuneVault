import { useState, type ReactNode } from 'react';
import type { MediaItem } from '../../types';
import { PlayerContext } from '../../contexts/PlayerContext';
import { playerService } from '../../services/playerService';
import { getStoredVolume, shuffleItems, storeVolume } from '../../utils/mediaHelpers';

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queue, setQueueState] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [allMediaItems, setAllMediaItems] = useState<MediaItem[]>([]);
  const [volume, setVolumeState] = useState<number>(() => getStoredVolume());

  const setVolume = (nextVolume: number) => {
    const clamped = Math.min(1, Math.max(0, nextVolume));
    setVolumeState(clamped);
    storeVolume(clamped);
  };

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

  const setQueue = async (tracks: MediaItem[], startIndex: number = 0) => {
    if (tracks.length > 0) {
      setQueueState(tracks);
      setCurrentIndex(startIndex);
      await playTrack(tracks[startIndex]);
    }
  };

  const playAtIndex = async (index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      await playTrack(queue[index]);
    }
  };

  const playNext = async () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      await playAtIndex(currentIndex + 1);
    }
  };

  const playPrev = async () => {
    if (queue.length > 0 && currentIndex > 0) {
      await playAtIndex(currentIndex - 1);
    }
  };

  const shuffleQueue = async () => {
    if (queue.length <= 1 || currentIndex < 0) return;

    const current = queue[currentIndex];
    const rest = queue.filter((_, index) => index !== currentIndex);
    const shuffled = shuffleItems(rest);
    const nextQueue = [current, ...shuffled];

    setQueueState(nextQueue);
    setCurrentIndex(0);
    await playTrack(current);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        streamUrl,
        isLoading,
        playTrack,
        queue,
        currentIndex,
        allMediaItems,
        setAllMediaItems,
        volume,
        setVolume,
        setQueue,
        playAtIndex,
        playNext,
        playPrev,
        shuffleQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
