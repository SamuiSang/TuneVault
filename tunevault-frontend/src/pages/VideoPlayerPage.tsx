import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VideoPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Thêm hook này để lấy data truyền từ Home sang
  
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Đón dữ liệu video được gửi qua từ hàm navigate bên trang Home
    const passedVideoData = location.state?.videoData;

    if (passedVideoData) {
      setVideo(passedVideoData);
      setLoading(false);
    } else {
      // Đề phòng trường hợp user F5 lại trang hoặc copy link dán thẳng vào trình duyệt 
      // (lúc này state bị mất), bạn sẽ cần gọi API ở đây.
      console.log("Không tìm thấy data truyền sang, cần gọi API getById ở đây.");
      setLoading(false);
    }
  }, [location.state, id]);

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

      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          controls
          autoPlay
          className="w-full h-auto aspect-video"
          src={videoSrc} // Link video chính xác sẽ được nạp vào đây
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        {/* Tên ca sĩ / Owner */}
        <p className="mt-2 text-spotify-subtext">
          {video.ownerId || 'Unknown Artist'}
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