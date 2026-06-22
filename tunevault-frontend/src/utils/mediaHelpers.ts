import type { MediaItem } from '../types';

export const VOLUME_STORAGE_KEY = 'tunevault-volume';

export const getStoredVolume = (): number => {
  const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
  if (stored === null) return 1;
  const parsed = parseFloat(stored);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 1;
};

export const storeVolume = (volume: number) => {
  localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
};

export const filterAudio = (items: MediaItem[]) =>
  items.filter((item) => item.type === 'Audio');

export const filterVideo = (items: MediaItem[]) =>
  items.filter((item) => item.type === 'Video');

export const findMatchingVideo = (audio: MediaItem, allItems: MediaItem[]): MediaItem | undefined =>
  allItems.find(
    (item) =>
      item.type === 'Video' &&
      item.title.trim().toLowerCase() === audio.title.trim().toLowerCase()
  );

export const shuffleItems = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
