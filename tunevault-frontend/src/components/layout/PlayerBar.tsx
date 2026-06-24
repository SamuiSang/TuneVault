import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { usePlayer } from '../../hooks/usePlayer'; 
// ĐÃ THÊM: Icon FiShare2
import { FiVolume2, FiVolumeX, FiList, FiShare2, FiMonitor } from 'react-icons/fi'; 
import { FaHeart } from 'react-icons/fa';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShareModal from '../ShareModal'; 
import { interactionService } from '../../services/interactionService';
import { mediaService } from '../../services/mediaService';
import type { MediaItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PlayerBarProps {
  onToggleQueue?: () => void;
  isQueueOpen?: boolean;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ onToggleQueue, isQueueOpen }) => {
  // ---> BỔ SUNG CHO HIẾU: Gọi playNext, playPrev từ Context <---
  const { currentTrack, streamUrl, isLoading, playNext, playPrev, setQueue } = usePlayer(); 
  const playerRef = useRef<AudioPlayer>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [volume, setVolume] = useState<number>(() => {
    const savedVol = localStorage.getItem('playerVolume');
    return savedVol !== null ? parseFloat(savedVol) : 1;
  });
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [alternativeTrack, setAlternativeTrack] = useState<MediaItem | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (currentTrack) {
      mediaService.getAllMedia().then(all => {
        const cleanTitle = (title: string) => title.replace(/\(mp3\)|\(m\/v\)/gi, '').trim().toLowerCase();
        const currentClean = cleanTitle(currentTrack.title);
        
        let alt = all.find(t => t.type !== currentTrack.type && cleanTitle(t.title) === currentClean);
        
        setAlternativeTrack(alt || null);
      });
    } else {
      setAlternativeTrack(null);
    }
  }, [currentTrack]);

  useEffect(() => {
    const checkLiked = async () => {
      const userId = user?.id || localStorage.getItem('userId');
      if (userId && currentTrack?.id) {
        try {
          const liked = await interactionService.checkIsLiked(userId, currentTrack.id);
          setIsLiked(liked);
        } catch (e) { console.error(e); }
      }
    };
    checkLiked();
  }, [currentTrack?.id, user?.id]);

  const handleToggleLike = async () => {
    const userId = user?.id || localStorage.getItem('userId');
    if (!userId || !currentTrack?.id) return;
    try {
      if (isLiked) {
        await interactionService.unlikeSong(userId, currentTrack.id);
        setIsLiked(false);
      } else {
        await interactionService.likeSong(userId, currentTrack.id);
        setIsLiked(true);
      }
      // Gửi event để màn hình Yêu thích tải lại nếu cần
      window.dispatchEvent(new Event('favorites_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('playerVolume', newVolume.toString());
    if (playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handlePause = () => playerRef.current?.audio.current?.pause();
    window.addEventListener('pause_audio', handlePause);
    return () => window.removeEventListener('pause_audio', handlePause);
  }, []);

  const handlePlayVideo = () => {
    if (currentTrack?.type === 'Video') {
      playerRef.current?.audio.current?.pause();
      navigate(`/video/${currentTrack.id}`, { state: { videoData: currentTrack } });
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
                <div 
                  className="text-xs text-spotify-subtext hover:underline cursor-pointer"
                  onClick={() => navigate(`/artist/${currentTrack.ownerId}`)}
                >
                  {currentTrack.ownerName || currentTrack.ownerId}
                </div>
              </div>
              
              {/* Nút Like Nhạc (Nằm kế bên tên bài hát) */}
              <button 
                onClick={handleToggleLike}
                className={`ml-2 p-2 hover:scale-110 transition-all cursor-pointer ${isLiked ? 'text-spotify-primary' : 'text-spotify-subtext hover:text-white'}`}
                title="Yêu thích bài hát này"
              >
                <FaHeart className="text-xl" />
              </button>
              
              {/* ĐÃ THÊM: Nút Switch MP3/MP4 (Chỉ hiện khi đang nghe Audio và KHÔNG ở trang Video) */}
              {currentTrack.type !== 'Video' && !location.pathname.includes('/video/') && (
                <button 
                  onClick={() => {
                    if (alternativeTrack) {
                       if (alternativeTrack.type === 'Video') {
                          playerRef.current?.audio.current?.pause();
                          navigate(`/video/${alternativeTrack.id}`, { state: { videoData: alternativeTrack, noQueue: true } });
                       } else {
                          // Bỏ switch từ Video về Audio
                          if (window.location.pathname.includes('/video/')) {
                             navigate(-1);
                          }
                       }
                    } else {
                       alert("Không tìm thấy phiên bản " + (currentTrack.type === 'Audio' ? 'MP4' : 'MP3') + " của bài hát này!");
                    }
                  }}
                  className={`ml-3 px-2 py-1 text-[10px] font-bold rounded border transition-all ${alternativeTrack ? 'border-spotify-primary text-spotify-primary hover:bg-spotify-primary hover:text-black cursor-pointer shadow-[0_0_8px_rgba(29,215,96,0.5)]' : 'border-gray-600 text-gray-600 cursor-not-allowed opacity-50'}`}
                  title={alternativeTrack ? `Chuyển sang ${alternativeTrack.type}` : 'Không có phiên bản khác'}
                >
                  {currentTrack.type === 'Audio' ? 'MP4' : 'MP3'}
                </button>
              )}

              {/* ĐÃ THÊM: Nút Share Nhạc (Nằm kế bên tên bài hát) */}
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="ml-1 p-2 text-spotify-subtext hover:text-white hover:scale-110 transition-all cursor-pointer"
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
            autoPlay={currentTrack?.type !== 'Video'}
            src={currentTrack?.type !== 'Video' ? streamUrl || undefined : undefined} 
            onPlay={() => {
              if (currentTrack?.id) {
                const currentUserId = user?.id || localStorage.getItem('userId');
                if (currentUserId) {
                  interactionService.addPlayHistory(currentUserId, currentTrack.id).catch(e => console.error(e));
                }
              }
            }}
            
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

        <div className="w-1/4 flex justify-end items-center gap-3 text-spotify-subtext pr-4 relative">
          {currentTrack?.type === 'Video' && (
            <button 
              onClick={handlePlayVideo} 
              className="text-xl text-spotify-primary hover:scale-110 transition-transform mr-2"
              title="Xem Video"
            >
              <FiMonitor />
            </button>
          )}

          <div className="relative">
            <button onClick={onToggleQueue} className={`text-xl hover:text-white transition-colors mr-2 ${isQueueOpen ? 'text-spotify-primary' : ''}`} title="Hàng đợi">
              <FiList />
            </button>
          </div>
          
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