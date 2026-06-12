import api from './api';

// Định nghĩa kiểu dữ liệu trả về từ API (nếu cần)
interface StreamResponse {
  streamUrl: string;
}

export const playerService = {
  // Hàm lấy URL phát nhạc động dựa vào ID của bài hát
  getStreamUrl: async (trackId: string): Promise<string> => {
    // Gọi lên endpoint của C# Backend (Ví dụ: /api/tracks/{id}/stream)
    const response = await api.get<StreamResponse>(`/tracks/${trackId}/stream`);
    return response.data.streamUrl;
  }
};