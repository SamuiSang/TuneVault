import api from './api';

const API_URL = "https://localhost:7277/api/search";

export const searchMedia = async (keyword: string) => {
  const response = await api.get(`${API_URL}/media`, {
    params: { keyword }
  });

  return response.data;
};

export const searchArtists = async (keyword: string) => {
  const response = await api.get(`${API_URL}/artists`, {
    params: { keyword }
  });

  return response.data;
};

export const searchPlaylists = async (keyword: string) => {
  const response = await api.get(`${API_URL}/playlists`, {
    params: { keyword }
  });

  return response.data;
};