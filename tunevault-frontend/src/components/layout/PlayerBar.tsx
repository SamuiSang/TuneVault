import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { usePlayer } from '../../contexts/PlayerContext'; // Import hook

const PlayerBar = () => {
  const { currentTrack } = usePlayer(); // Lấy bài hát đang phát

  return (
    <div className="h-24 bg-black border-t border-spotify-elevated flex items-center px-4">
      {/* Thông tin bài hát */}
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

      {/* Trình phát nhạc trung tâm */}
      <div className="flex-1 max-w-2xl mx-auto">
        {/* Tùy chỉnh CSS của react-h5-audio-player bằng Tailwind class trong file global css sau */}
        <AudioPlayer
          autoPlay={true}
          src={currentTrack?.filePath || ""} // Truyền URL bài hát vào đây
          onPlay={() => console.log("onPlay", currentTrack?.title)}
          showSkipControls={true}
          showJumpControls={false}
          layout="stacked-reverse"
          customAdditionalControls={[]}
          className="bg-transparent shadow-none"
        />
      </div>

      {/* Các control phụ (Volume, Queue) */}
      <div className="w-1/4 flex justify-end items-center gap-2 text-spotify-subtext">
        {/* Placeholder cho Volume control */}
        <div className="w-24 h-1 bg-spotify-subtext rounded-full"></div>
      </div>
    </div>
  );
};

export default PlayerBar;