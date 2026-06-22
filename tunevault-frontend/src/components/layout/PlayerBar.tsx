import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { usePlayer } from '../../hooks/usePlayer';
import { FiVolume2, FiVolumeX, FiList, FiShare2, FiVideo } from 'react-icons/fi';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareModal from '../ShareModal';
import QueuePanel from './QueuePanel';
import { findMatchingVideo } from '../../utils/mediaHelpers';

const PlayerBar = () => {
  const {
    currentTrack,
    streamUrl,
    isLoading,
    playNext,
    playPrev,
    allMediaItems,
    volume,
    setVolume,
  } = usePlayer();
  const navigate = useNavigate();
  const playerRef = useRef<AudioPlayer>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current?.audio.current) {
      playerRef.current.audio.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (playerRef.current?.audio.current) {
      playerRef.current.audio.current.volume = volume;
    }
  }, [streamUrl, volume]);

  const matchingVideo =
    currentTrack && allMediaItems.length > 0
      ? findMatchingVideo(currentTrack, allMediaItems)
      : undefined;

  const handleOpenVideo = () => {
    if (!matchingVideo) return;
    navigate(`/video/${matchingVideo.id}`, { state: { videoData: matchingVideo } });
  };

  return (
    <>
      <div className="h-24 bg-black border-t border-spotify-elevated flex items-center px-4">
        <div className="w-1/4 flex items-center gap-4">
          {currentTrack ? (
            <>
              <img
                src={currentTrack.thumbnailUrl || 'default-cover.png'}
                alt="cover"
                className="w-14 h-14 object-cover rounded shadow"
              />
              <div className="flex flex-col">
                <span
                  className="text-spotify-text text-sm font-semibold hover:underline cursor-pointer truncate max-w-[150px]"
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </span>
                <span className="text-spotify-subtext text-xs hover:underline cursor-pointer truncate max-w-[150px]">
                  {currentTrack.ownerId}
                </span>
              </div>

              {matchingVideo && (
                <button
                  onClick={handleOpenVideo}
                  className="ml-1 p-2 text-spotify-subtext hover:text-white hover:scale-110 transition-all cursor-pointer"
                  title="Xem video của bài hát này"
                >
                  <FiVideo className="text-xl" />
                </button>
              )}

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
              <div className="w-14 h-14 bg-spotify-elevated rounded shadow" />
              <div className="flex flex-col">
                <span className="text-spotify-text text-sm font-semibold">Chưa có bài hát</span>
                <span className="text-spotify-subtext text-xs">Nghệ sĩ</span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 max-w-2xl mx-auto flex flex-col items-center">
          {isLoading && (
            <span className="text-xs text-white bg-spotify-elevated px-2 py-0.5 rounded animate-pulse mb-1">
              Đang thiết lập luồng truyền phát nhạc từ máy chủ...
            </span>
          )}

          <AudioPlayer
            ref={playerRef}
            autoPlay
            src={streamUrl || undefined}
            onPlay={() => console.log('onPlay', currentTrack?.title)}
            showSkipControls
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
          <button
            onClick={() => setIsQueueOpen((open) => !open)}
            className={`transition-colors mr-2 ${isQueueOpen ? 'text-spotify-primary' : 'hover:text-white'}`}
            title="Hàng đợi phát"
          >
            <FiList className="text-xl" />
          </button>

          {isQueueOpen && <QueuePanel onClose={() => setIsQueueOpen(false)} />}

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

      {isShareModalOpen && currentTrack && (
        <ShareModal
          mediaId={currentTrack.id || ''}
          mediaTitle={currentTrack.title}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </>
  );
};

export default PlayerBar;
