export interface AppUser {
  id: string; // Kế thừa từ IdentityUser
  userName: string;
  email: string;
  displayName?: string; 
  bio?: string; 
  avatarUrl?: string;
  isArtist: boolean; 
}
// Đã xóa interface Artist

export interface Album {
  id: string;
  title: string;
  releaseDate: string; 
  coverImageUrl?: string;
  artistId: string; // Trỏ về AppUser.id
}

export interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
  type: 'Audio' | 'Video'; 
  duration: number; 
  filePath: string;
  albumId?: string; 
  ownerId: string; // Người upload (AppUser)
  ownerName?: string;
}

export interface Playlist {
  id: string;
  name: string;
  isPublic: boolean; 
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
  followeeId: string; // Bắt buộc trỏ về AppUser (bao gồm cả user thường và artist)
  // Đã xóa trường artistId
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
  artistId: string; // Trỏ về AppUser.id (user có isArtist = true)
}
// ---> Kết thúc bảng trung gian <---

// --->  AXIOS VÀ AUTH CONTEXT  <---
// Định nghĩa form gửi lên khi Login khớp với LoginCommand.cs
export interface LoginRequest {
  emailOrUsername: string; // <-- Đổi thành emailOrUsername
  password: string;
}

// Định nghĩa form gửi lên khi Register
export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
}


// Khớp hoàn toàn với BaseResponse<T> trong BaseResponse.cs
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
}
// ---> END: AXIOS VÀ AUTH CONTEXT  <---