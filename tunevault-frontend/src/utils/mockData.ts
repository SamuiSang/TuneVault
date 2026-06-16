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
  }
];