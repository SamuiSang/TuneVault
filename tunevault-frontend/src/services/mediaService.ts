import api from './api';
import type { MediaItem } from '../types';

export const mediaService = {
  getAllMedia: async (): Promise<MediaItem[]> => {
    const response = await api.get<MediaItem[]>('/media/all');
    return response.data;
  },

  getMediaById: async (id: string): Promise<MediaItem> => {
    const response = await api.get<MediaItem>(`/media/${id}`);
    return response.data;
  },
};
