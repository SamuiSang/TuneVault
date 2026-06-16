import { createContext } from 'react';
import type { MediaItem } from '../types';

export interface PlayerContextType {
  currentTrack: MediaItem | null;
  streamUrl: string;
  isLoading: boolean;
  playTrack: (track: MediaItem) => Promise<void>;
  
  // ---> BỔ SUNG CHO HIẾU: Thêm State và Hàm quản lý Queue <---
  queue: MediaItem[];
  currentIndex: number;
  setQueue: (tracks: MediaItem[], startIndex?: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
}

// Khởi tạo và export đối tượng Context ra ngoài
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);