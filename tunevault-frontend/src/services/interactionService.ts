import api from './api'; 

export interface MediaItemDto {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  filePath: string;
}

export const interactionService = {
  // 1. Lấy danh sách bài hát đã thích (Yêu thích)
  getLikedSongs: async (): Promise<MediaItemDto[]> => {
    const response = await api.get('/api/interactions/liked-songs');
    return response.data;
  },

  // 2. Lấy lịch sử nghe nhạc gần đây
  getListeningHistory: async (): Promise<MediaItemDto[]> => {
    const response = await api.get('/api/interactions/history');
    return response.data;
  },

  // 3. Thêm hoặc bỏ thích bài hát (Toggle Like)
  toggleLikeSong: async (mediaId: string): Promise<{ isLiked: boolean }> => {
    const response = await api.post(`/api/interactions/like/${mediaId}`);
    return response.data;
  }
};