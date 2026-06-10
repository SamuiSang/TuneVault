// ---> AXIOS VÀ AUTH CONTEXT  <---
import axios from 'axios';

// Thay đổi port nếu Backend của bạn chạy port khác
const API_BASE_URL = 'https://localhost:7277/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token trước khi gọi API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động đá văng ra ngoài nếu Backend báo lỗi 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth'; // Chuyển về trang Auth
    }
    return Promise.reject(error);
  }
);

export default api;
// ---> END: AXIOS VÀ AUTH CONTEXT  <---