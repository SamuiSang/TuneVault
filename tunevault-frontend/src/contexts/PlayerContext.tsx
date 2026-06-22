import { createContext } from 'react';
import type { MediaItem } from '../types';

export interface PlayerContextType {
  currentTrack: MediaItem | null;
  streamUrl: string;
  isLoading: boolean;
  playTrack: (track: MediaItem) => Promise<void>;
  queue: MediaItem[];
  currentIndex: number;
  allMediaItems: MediaItem[];
  setAllMediaItems: (items: MediaItem[]) => void;
  volume: number;
  setVolume: (volume: number) => void;
  setQueue: (tracks: MediaItem[], startIndex?: number) => Promise<void>;
  playAtIndex: (index: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  shuffleQueue: () => Promise<void>;
}

// Khởi tạo và export đối tượng Context ra ngoài
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);