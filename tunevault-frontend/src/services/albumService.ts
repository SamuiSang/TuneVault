import api from './api';

export interface Album {
  id: string;
  title: string;
  releaseDate: string;
  coverImageUrl: string;
  artistId: string;
  artistName: string;
}

export interface AlbumTrack {
  id: string;
  title: string;
  thumbnailUrl: string;
  type: string;
  duration: number;
  filePath: string;
  ownerId: string;
  ownerName: string;
}

export interface AlbumDetail extends Album {
  tracks: AlbumTrack[];
}

export const albumService = {
  getAlbumsByArtistId: async (artistId: string): Promise<Album[]> => {
    const response = await api.get(`/Albums/artist/${artistId}`);
    return response.data.data || [];
  },

  getAlbumById: async (albumId: string): Promise<AlbumDetail> => {
    const response = await api.get(`/Albums/${albumId}`);
    return response.data.data;
  }
};
