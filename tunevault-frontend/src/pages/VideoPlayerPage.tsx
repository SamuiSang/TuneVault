import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mediaService } from '../services/mediaService';
import { playerService } from '../services/playerService';
import { getStoredVolume, storeVolume } from '../utils/mediaHelpers';
import type { MediaItem } from '../types';

const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<MediaItem | null>(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [volume, setVolume] = useState(() => getStoredVolume());

  useEffect(() => {
    const loadVideo = async () => {
      const passedVideoData = location.state?.videoData as MediaItem | undefined;

      try {
        let videoData = passedVideoData;
        if (!videoData && id) {
          videoData = await mediaService.getMediaById(id);
        }

        if (!videoData) {
          setVideo(null);
          return;
        }

        setVideo(videoData);

        const streamUrl = await playerService.getStreamUrl(videoData.id);
        setVideoSrc(streamUrl || videoData.filePath);
      } catch (error) {
        console.error('Không thể tải video:', error);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [location.state, id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [videoSrc, volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = parseFloat(e.target.value);
    setVolume(nextVolume);
    storeVolume(nextVolume);
    if (videoRef.current) {
      videoRef.current.volume = nextVolume;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Đang tải video...</div>;
  }

  if (!video) {
    return (
      <div className="text-center mt-10 text-white">
        Không tìm thấy video. Vui lòng quay lại trang chủ.
      </div>
    );
  }

  return (
    <div className="video-player-wrapper p-6 max-w-4xl mx-auto text-spotify-text min-h-screen bg-black">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition font-medium"
      >
        &larr; Quay lại
      </button>

      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          controls
          autoPlay
          className="w-full h-auto aspect-video"
          src={videoSrc}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </div>

      <div className="mt-4 flex items-center gap-3 max-w-xs">
        <span className="text-sm text-spotify-subtext">Âm lượng</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-spotify-subtext rounded-full appearance-none cursor-pointer accent-spotify-primary"
        />
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="mt-2 text-spotify-subtext">{video.ownerId || 'Unknown Artist'}</p>
        {video.description && <p className="mt-4 text-gray-400 text-sm">{video.description}</p>}
      </div>
    </div>
  );
};

export default VideoPlayerPage;
