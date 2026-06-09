//trước khi có api
import { createContext, useState, useContext, type ReactNode } from 'react';
import type { MediaItem } from '../types';

interface PlayerContextType {
  currentTrack: MediaItem | null;
  playTrack: (track: MediaItem) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<MediaItem | null>(null);

  const playTrack = (track: MediaItem) => {
    setCurrentTrack(track);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, playTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Hook custom để sử dụng nhanh
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};