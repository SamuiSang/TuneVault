import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { usePlayer } from '../../contexts/PlayerContext'; // Import hook
import { FiVolume2, FiVolumeX, FiList } from 'react-icons/fi'; // Import thêm icon loa từ thư viện react-icons bạn đã cài
import React, { useRef, useState } from 'react';

const PlayerBar = () => {
  const { currentTrack } = usePlayer(); // Lấy bài hát đang phát

  // Tạo ref để "móc" vào thư viện audio player
  const playerRef = useRef<AudioPlayer>(null);
  // State quản lý giá trị âm lượng (từ 0 đến 1)
  const [volume, setVolume] = useState(1);

  // Hàm xử lý khi bạn kéo thanh âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // Ép âm lượng của thẻ audio gốc thay đổi theo
    if (playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.volume = newVolume;
    }
  };

  return (
    <div className="h-24 bg-black border-t border-spotify-elevated flex items-center px-4">
      {/* THÔNG TIN BÀI HÁT*/}
      <div className="w-1/4 flex items-center gap-4">
        {currentTrack ? (
          <>
            <img 
              src={currentTrack.thumbnailUrl} 
              alt="cover" 
              className="w-14 h-14 object-cover rounded shadow"
            />
            <div className="flex flex-col">
              <span className="text-spotify-text text-sm font-semibold hover:underline cursor-pointer truncate max-w-[150px]" title={currentTrack.title}>
                {currentTrack.title}
              </span>
              <span className="text-spotify-subtext text-xs hover:underline cursor-pointer truncate max-w-[150px]">
                {currentTrack.ownerId}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-spotify-elevated rounded shadow">
              {/* Cover image placeholder */}
            </div>
            <div className="flex flex-col">
              <span className="text-spotify-text text-sm font-semibold">
                Chưa có bài hát
              </span>
              <span className="text-spotify-subtext text-xs">
                Nghệ sĩ
              </span>
            </div>
          </>
        )}
      </div>
      {/* END: THÔNG TIN BÀI HÁT */}
      {/* Trình phát nhạc trung tâm */}
      <div className="flex-1 max-w-2xl mx-auto">
        {/* Tùy chỉnh CSS của react-h5-audio-player bằng Tailwind class trong file global css sau */}
        <AudioPlayer
          ref={playerRef} // Thêm ref để lấy thẻ audio nội bộ
          autoPlay={true}
          src={currentTrack?.filePath || ""} // Truyền URL bài hát vào đây
          onPlay={() => console.log("onPlay", currentTrack?.title)}
          showSkipControls={true}
          showJumpControls={false}
          layout="stacked-reverse"
          customAdditionalControls={[]}
          customVolumeControls={[]} // Tắt volume mặc định bị lộn xộn của thư viện
          className="bg-transparent shadow-none"
        />
      </div>

      {/* Các control phụ (Volume, Queue) */}
      <div className="w-1/4 flex justify-end items-center gap-3 text-spotify-subtext pr-4">
        {/* Nút Danh sách chờ (Mock) */}
        <FiList className="text-xl hover:text-white cursor-pointer transition-colors mr-2" />
        
        {/* Icon Loa (Thay đổi theo trạng thái âm lượng) */}
        <div className="cursor-pointer hover:text-white transition-colors">
          {volume === 0 ? <FiVolumeX className="text-xl" /> : <FiVolume2 className="text-xl" />}
        </div>
        
        {/* Thanh kéo Volume tự chế thay thế cho placeholder cũ */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-spotify-subtext rounded-full appearance-none cursor-pointer accent-white hover:accent-spotify-primary transition-all"
        />
      </div>
    </div>
  );
};

export default PlayerBar;