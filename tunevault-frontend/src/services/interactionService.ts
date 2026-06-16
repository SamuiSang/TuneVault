import api from './api'; 

export interface MediaItemDto {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string;
  filePath: string;
}

export interface FollowerDto {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export const interactionService = {
  // Lấy danh sách bài hát đã bấm thích
  getLikedSongs: async (): Promise<MediaItemDto[]> => {
    const response = await api.get('/api/interactions/liked-songs');
    return response.data;
  },

  // Lấy lịch sử các bài hát đã nghe gần đây
  getListeningHistory: async (): Promise<MediaItemDto[]> => {
    const response = await api.get('/api/interactions/history');
    return response.data;
  },

  // Thêm hoặc bỏ thích bài hát (Toggle Like)
  toggleLikeSong: async (mediaId: string): Promise<{ isLiked: boolean }> => {
    const response = await api.post(`/api/interactions/like/${mediaId}`);
    return response.data;
  },

  // Bắt đầu theo dõi nghệ sĩ hoặc người dùng khác
  followUser: async (targetId: string): Promise<void> => {
    await api.post(`/api/interactions/follow/${targetId}`);
  },

  // Hủy theo dõi nghệ sĩ hoặc người dùng
  unfollowUser: async (targetId: string): Promise<void> => {
    await api.post(`/api/interactions/unfollow/${targetId}`); 
  },

  // Kiểm tra trạng thái đã follow chưa để hiển thị đúng giao diện nút bấm
  checkIsFollowing: async (targetId: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/api/interactions/is-following/${targetId}`);
    return response.data;
  }
};