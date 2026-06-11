// Test khi chưa xong API
import type { MediaItem } from '../types';

export const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    title: "Beyond the Edge (feat. 花隈千冬)",
    thumbnailUrl: "/Beyond the Edge (feat. 花隈千冬) - Xyris.png",
    type: "Audio",
    duration: 245,
    filePath: "/Beyond the Edge (feat. 花隈千冬) - Xyris.mp3", // Link test public
    // Thêm ownerId vào đây để thỏa mãn Interface
    ownerId: "Xyris" 
  },
  {
    id: "2",
    title: "Mưa Tình Yêu",
    thumbnailUrl: "https://link-anh-bia-gia.com/anh2.jpg",
    type: "Audio",
    duration: 180,
    filePath: "https://link-nhac-gia.com/nhac2.mp3",
    ownerId: "user-2"
  }
];