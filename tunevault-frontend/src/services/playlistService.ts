import api from "./api";

const API_URL = "http://localhost:5277/api/playlists";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
}

export interface UpdatePlaylistRequest {
  name: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}

/**
 * Lấy danh sách playlist của user
 */
export const getUserPlaylists = async (
  userId: string
) => {
  const response = await api.get(
    `${API_URL}/user/${userId}`
  );

  return response.data;
};

/**
 * Chi tiết playlist
 */
export const getPlaylistDetail = async (
  playlistId: string
) => {
  const response = await api.get(
    `${API_URL}/${playlistId}`
  );

  return response.data;
};

/**
 * Tạo playlist
 */
export const createPlaylist = async (
  payload: CreatePlaylistRequest
) => {
  const response = await api.post(
    API_URL,
    payload
  );

  return response.data;
};

/**
 * Cập nhật playlist
 */
export const updatePlaylist = async (
  playlistId: string,
  payload: UpdatePlaylistRequest
) => {
  const response = await api.put(
    `${API_URL}/${playlistId}`,
    payload
  );

  return response.data;
};

/**
 * Xóa playlist
 */
export const deletePlaylist = async (
  playlistId: string
) => {
  const response = await api.delete(
    `${API_URL}/${playlistId}`
  );

  return response.data;
};

/**
 * Thêm bài hát vào playlist
 */
export const addTrackToPlaylist = async (
  playlistId: string,
  mediaId: string
) => {
  const response = await api.post(
    `${API_URL}/${playlistId}/tracks/${mediaId}`
  );

  return response.data;
};

/**
 * Xóa bài hát khỏi playlist
 */
export const removeTrackFromPlaylist = async (
  playlistId: string,
  mediaId: string
) => {
  const response = await api.delete(
    `${API_URL}/${playlistId}/tracks/${mediaId}`
  );

  return response.data;
};

/**
 * Danh sách media được chia sẻ với tôi
 */
export const getSharedWithMe = async (
  userId: string
) => {
  const response = await api.get(
    `${API_URL}/shared-with-me/${userId}`
  );

  return response.data;
};

/**
 * Xóa danh sách media được chia sẻ với tôi
 */
export const deleteSharedItems = async (
  shareIds: string[]
) => {
  const response = await api.delete(
    `${API_URL}/shared-with-me`, {
      data: shareIds
    }
  );

  return response.data;
};