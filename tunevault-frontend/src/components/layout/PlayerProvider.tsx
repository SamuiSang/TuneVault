import React, { useState, type ReactNode } from 'react';
import type { MediaItem } from '../../types';
import { PlayerContext } from '../../contexts/PlayerContext';
import { playerService } from '../../services/playerService';

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  return (
    <PlayerContext.Provider value={{ currentTrack, streamUrl, isLoading, playTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};