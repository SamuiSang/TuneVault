import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { interactionService } from '../services/interactionService';
import api from '../services/api';

const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack, playNext, playPrev, queue, currentIndex, setQueue } = usePlayer();
  
  const [localVideo, setLocalVideo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Tạm dừng nhạc nền nếu đang phát
    window.dispatchEvent(new Event('pause_audio'));

    // Nếu currentTrack từ PlayerContext là video đang cần xem, thì không cần fetch
    if (currentTrack && currentTrack.type === 'Video' && currentTrack.id === id) {
      setLoading(false);
      return;
    }

    const fetchVideo = async () => {
      setLoading(true);
      if (location.state?.videoData && location.state.videoData.id === id) {
        setLocalVideo(location.state.videoData);
        if ((!currentTrack || currentTrack.id !== id) && !location.state?.noQueue) {
           setQueue([location.state.videoData]);
        }
      } else {
        try {
          const res = await api.get(`/media/${id}`);
          setLocalVideo(res.data);
          if ((!currentTrack || currentTrack.id !== id) && !location.state?.noQueue) {
             setQueue([res.data]);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };

    fetchVideo();
  }, [id, currentTrack?.id]);

  useEffect(() => {
    // Tự động chuyển URL nếu currentTrack thay đổi (do bấm Next/Prev)
    if (currentTrack && currentTrack.type === 'Video' && currentTrack.id !== id) {
      navigate(`/video/${currentTrack.id}`, { replace: true });
    }
  }, [currentTrack, id, navigate]);

  const video = (currentTrack?.type === 'Video' && currentTrack?.id === id) ? currentTrack : localVideo;

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Đang tải video...</div>;
  }

  if (!video) {
    return <div className="text-center mt-10 text-white">Không tìm thấy video. Vui lòng quay lại trang chủ.</div>;
  }

  // QUAN TRỌNG: Hãy kiểm tra xem API của bạn trả về link video nằm ở trường nào
  // Mình đang để sẵn là video.filePath hoặc video.url, bạn chỉnh lại cho đúng với DB của nhóm nhé.
  const videoSrc = video.filePath || video.url || video.mediaUrl || "";

  return (
    <div className="video-player-wrapper p-6 max-w-4xl mx-auto text-spotify-text">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition font-medium"
      >
        &larr; Quay lại
      </button>

      <div className="bg-black rounded-lg overflow-hidden shadow-lg relative group">
        <video
          controls
          autoPlay
          onPlay={() => {
            if (video?.id) {
               const currentUserId = localStorage.getItem('userId');
               if (currentUserId) {
                  interactionService.addPlayHistory(currentUserId, video.id).catch(e => console.error(e));
               }
            }
          }}
          onEnded={playNext}
          className="w-full h-auto aspect-video"
          src={videoSrc} // Link video chính xác sẽ được nạp vào đây
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>

        {/* Nút Next/Prev cho Video Queue */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <button onClick={(e) => { e.stopPropagation(); playPrev(); }} disabled={currentIndex <= 0} className="w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center pointer-events-auto hover:bg-spotify-primary hover:text-black transition disabled:opacity-0 disabled:pointer-events-none">
             <FaStepBackward />
           </button>
           <button onClick={(e) => { e.stopPropagation(); playNext(); }} disabled={currentIndex >= queue.length - 1} className="w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center pointer-events-auto hover:bg-spotify-primary hover:text-black transition disabled:opacity-0 disabled:pointer-events-none">
             <FaStepForward />
           </button>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        {/* Tên ca sĩ / Owner */}
        <p className="text-spotify-subtext mt-2 text-lg">
          {video.ownerName || video.ownerId || 'Unknown Artist'}
        </p>
        
        {/* Nếu có mô tả thì hiện */}
        {video.description && (
          <p className="mt-4 text-gray-400 text-sm">{video.description}</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;