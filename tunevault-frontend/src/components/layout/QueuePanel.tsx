import { FiX, FiShuffle } from 'react-icons/fi';
import { usePlayer } from '../../hooks/usePlayer';

interface QueuePanelProps {
  onClose: () => void;
}

const QueuePanel = ({ onClose }: QueuePanelProps) => {
  const { queue, currentIndex, playAtIndex, shuffleQueue } = usePlayer();

  const upcoming = queue.slice(currentIndex + 1);

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-[#282828] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h4 className="font-bold text-sm">Hàng đợi phát</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={shuffleQueue}
            className="p-1.5 text-spotify-subtext hover:text-spotify-primary transition-colors"
            title="Xáo trộn hàng đợi"
          >
            <FiShuffle />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-spotify-subtext hover:text-white transition-colors"
          >
            <FiX />
          </button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        {queue.length === 0 ? (
          <p className="px-4 py-6 text-sm text-spotify-subtext text-center">
            Chưa có bài hát trong hàng đợi.
          </p>
        ) : (
          <>
            <div className="px-4 py-2 bg-white/5">
              <p className="text-xs text-spotify-subtext uppercase">Đang phát</p>
              <p className="text-sm font-medium truncate">{queue[currentIndex]?.title}</p>
            </div>

            {upcoming.length === 0 ? (
              <p className="px-4 py-4 text-sm text-spotify-subtext">Không còn bài tiếp theo.</p>
            ) : (
              upcoming.map((track, index) => (
                <button
                  key={`${track.id}-${index}`}
                  onClick={() => playAtIndex(currentIndex + 1 + index)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                >
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-spotify-subtext truncate">{track.ownerId}</p>
                </button>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueuePanel;
