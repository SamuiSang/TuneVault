// src/types/index.ts

export interface AppUser {
  id: string; // Kế thừa từ IdentityUser
  userName: string;
  email: string;
  bio?: string; // Tương đương string? trong C#
  avatarUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  releaseDate: string; // DateTime chuyển thành string (ISO format)
  coverImageUrl?: string;
  artistId: string;
}

export interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
  type: 'Audio' | 'Video'; // Giúp Frontend dễ dàng rẽ nhánh hiển thị Player
  duration: number; // int trong C#
  filePath: string;
  albumId?: string; // Guid? trong C#
  ownerId: string;
}

export interface Playlist {
  id: string;
  name: string;
  isPublic: boolean; // bool trong C#
  coverImageUrl?: string;
  ownerId: string;
}

export interface MediaShare {
  id: string;
  sharedAt: string;
  senderId: string;
  receiverId: string;
  mediaItemId?: string;
  playlistId?: string;
}

export interface Notification {
  id: string;
  type: string;
  payloadJson: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface PlayHistory {
  id: string;
  playedAt: string;
  userId: string;
  mediaItemId: string;
}

export interface Follow {
  id: string;
  createdAt: string;
  followerId: string;
  followeeId?: string;
  artistId?: string;
}

// Bảng trung gian (Tùy chọn hiển thị ở Frontend, nhưng cứ khai báo cho đủ)
export interface PlaylistTrack {
  playlistId: string;
  mediaItemId: string;
  addedAt: string;
}

export interface Favorite {
  userId: string;
  mediaItemId: string;
  createdAt: string;
}

export interface MediaArtist {
  mediaItemId: string;
  artistId: string;
}
// ---> Kết thúc bảng trung gian <---