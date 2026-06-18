import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { usePlayer } from '../../hooks/usePlayer'; 
// ĐÃ THÊM: Icon FiShare2
import { FiVolume2, FiVolumeX, FiList, FiShare2 } from 'react-icons/fi'; 
import React, { useRef, useState } from 'react';
// ĐÃ THÊM: Import cái Modal chia sẻ bồ vừa tạo (nằm ngay thư mục cha)
import ShareModal from '../ShareModal'; 

const PlayerBar = () => {
  // ---> BỔ SUNG CHO HIẾU: Gọi playNext, playPrev từ Context <---
  const { currentTrack, streamUrl, isLoading, playNext, playPrev } = usePlayer(); 
  const playerRef = useRef<AudioPlayer>(null);
  const [volume, setVolume] = useState(1);
  
  // ĐÃ THÊM: State quản lý việc đóng/mở Modal Share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.volume = newVolume;
    }
  };

  // ĐÃ THÊM: Bọc toàn bộ giao diện bằng thẻ Fragment <> ... </> để có thể render cái Modal ở dưới cùng
  return (
    <>
      <div className="h-24 bg-black border-t border-spotify-elevated flex items-center px-4">
        {/* THÔNG TIN BÀI HÁT*/}
        <div className="w-1/4 flex items-center gap-4">
          {currentTrack ? (
            <>
              <img 
                src={currentTrack.thumbnailUrl || 'default-cover.png'} 
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
              
              {/* ĐÃ THÊM: Nút Share Nhạc (Nằm kế bên tên bài hát) */}
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="ml-2 p-2 text-spotify-subtext hover:text-white hover:scale-110 transition-all cursor-pointer"
                title="Chia sẻ bài hát này"
              >
                <FiShare2 className="text-xl" />
              </button>
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
        <div className="flex-1 max-w-2xl mx-auto flex flex-col items-center">
          {isLoading && (
            <span className="text-xs text-white bg-spotify-elevated px-2 py-0.5 rounded animate-pulse mb-1">
              Đang thiết lập luồng truyền phát nhạc từ máy chủ...
            </span>
          )}

          <AudioPlayer
            ref={playerRef} 
            autoPlay={true}
            src={streamUrl || undefined} 
            onPlay={() => console.log("onPlay", currentTrack?.title)}
            
            // ---> BỔ SUNG CHO HIẾU: Bật nút bấm và tự động Next <---
            showSkipControls={true}
            showJumpControls={false}
            onClickNext={playNext}
            onClickPrevious={playPrev}
            onEnded={playNext} 

            layout="stacked-reverse"
            customAdditionalControls={[]}
            customVolumeControls={[]} 
            className={`bg-transparent shadow-none w-full transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
          />
        </div>

        {/* Các control phụ (Volume, Queue) */}
        <div className="w-1/4 flex justify-end items-center gap-3 text-spotify-subtext pr-4">
          <FiList className="text-xl hover:text-white cursor-pointer transition-colors mr-2" />
          
          <div className="cursor-pointer hover:text-white transition-colors">
            {volume === 0 ? <FiVolumeX className="text-xl" /> : <FiVolume2 className="text-xl" />}
          </div>
          
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

      {/* ĐÃ THÊM: Gọi Modal Chia sẻ Nhạc ra (Chỉ hiện khi isShareModalOpen = true) */}
      {isShareModalOpen && currentTrack && (
        <ShareModal 
          mediaId={currentTrack.id || ''} // Truyền ID bài hát đang phát vào
          mediaTitle={currentTrack.title} // Truyền tên bài hát vào
          onClose={() => setIsShareModalOpen(false)} // Tắt Modal
        />
      )}
    </>
  );
};

export default PlayerBar;