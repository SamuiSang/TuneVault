// ---> AXIOS VÀ AUTH CONTEXT  <---
import api from './api';
import type { LoginRequest, RegisterRequest, BaseResponse } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<BaseResponse<string>> => {
    const response = await api.post<BaseResponse<string>>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<BaseResponse<string>> => {
    const response = await api.post<BaseResponse<string>>('/auth/register', data);
    return response.data;
  }
};
// ---> END: AXIOS VÀ AUTH CONTEXT  <---