import api from './api'; 

const API_URL = "http://localhost:5277/api/Interactions";

export interface MediaItemDto {
  id: string;
  title: string;
  artistName: string;
  thumbnailUrl?: string;
  filePath: string;
  duration?: string;
}

export interface FollowerDto {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export const interactionService = {
  // Lấy danh sách bài hát đã bấm thích
  getLikedSongs: async (userId: string): Promise<MediaItemDto[]> => {
    const response = await api.get(`${API_URL}/favorites/${userId}?pageSize=100`);
    return response.data.data;
  },

  // Bấm thích bài hát
  likeSong: async (userId: string, mediaItemId: string): Promise<void> => {
    await api.post(`${API_URL}/favorites/add`, { userId, mediaItemId });
  },

  // Bỏ thích bài hát
  unlikeSong: async (userId: string, mediaItemId: string): Promise<void> => {
    await api.post(`${API_URL}/favorites/remove`, { userId, mediaItemId });
  },

  // Kiểm tra bài hát đã thích chưa
  checkIsLiked: async (userId: string, mediaItemId: string): Promise<boolean> => {
    const response = await api.get(`${API_URL}/favorites/check/${userId}/${mediaItemId}`);
    return response.data.isFavorite;
  },

  // Bắt đầu theo dõi nghệ sĩ hoặc người dùng khác
  followUser: async (targetId: string): Promise<void> => {
    await api.post(`${API_URL}/follow/${targetId}`);
  },

  // Hủy theo dõi nghệ sĩ hoặc người dùng
  unfollowUser: async (targetId: string): Promise<void> => {
    await api.post(`${API_URL}/unfollow/${targetId}`); 
  },

  // Kiểm tra trạng thái đã follow chưa để hiển thị đúng giao diện nút bấm
  checkIsFollowing: async (targetId: string): Promise<boolean> => {
    const response = await api.get<boolean>(`${API_URL}/is-following/${targetId}`);
    return response.data;
  }
};