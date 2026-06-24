import { useEffect, useState } from "react";
import { interactionService, type MediaItemDto } from "../services/interactionService";
import { useAuth } from "../contexts/AuthContext";
import { FaHeart, FaPlay } from "react-icons/fa";
import { usePlayer } from "../hooks/usePlayer";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { user } = useAuth();
  const { setQueue } = usePlayer();
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<MediaItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const userId = user?.id || localStorage.getItem("userId");
    if (!userId) return;
    try {
      setLoading(true);
      const data = await interactionService.getLikedSongs(userId);
      setLikedSongs(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();

    const handleUpdate = () => {
      fetchFavorites();
    };
    window.addEventListener("favorites_updated", handleUpdate);
    return () => window.removeEventListener("favorites_updated", handleUpdate);
  }, [user?.id]);

  const handlePlayAll = () => {
    const audioTracks = likedSongs.filter(t => t.type !== 'Video');
    if (audioTracks.length > 0) {
      setQueue(audioTracks as any);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white animate-pulse">
        <p>Đang tải bài hát đã thích...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white pb-24">
      <div className="mb-8 flex items-end gap-6 bg-gradient-to-b from-indigo-900 to-transparent p-6 rounded-xl">
        <div className="w-40 h-40 bg-gradient-to-br from-indigo-600 to-blue-300 flex items-center justify-center rounded-lg shadow-2xl border border-indigo-700/50">
          <FaHeart className="text-5xl text-white drop-shadow-md" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 tracking-wider">
            <span>Danh sách phát</span>
          </div>
          <h1 className="text-5xl font-extrabold my-2 text-white drop-shadow-sm">
            Bài hát đã thích
          </h1>
          <p className="text-sm font-medium text-white mt-4">
            <span className="text-spotify-primary">{user?.userName || "Bạn"}</span> • {likedSongs.length} bài hát
          </p>
          {likedSongs.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handlePlayAll}
                className="w-14 h-14 bg-spotify-primary rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-all"
                title="Phát tất cả"
              >
                <FaPlay className="ml-1 text-2xl" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        {likedSongs.length > 0 ? (
          <div className="space-y-2">
            {likedSongs.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-zinc-900/60 hover:bg-zinc-800/80 transition rounded-lg p-4 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-gray-500 w-4 text-center font-bold text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                  <span className="w-4 text-center hidden group-hover:block text-white" onClick={(e) => {
                    e.stopPropagation();
                    if (track.type === 'Video') {
                      navigate(`/video/${track.id}`, { state: { videoData: track } });
                    } else {
                      const nextAudioTracks = likedSongs.slice(index + 1).filter(t => t.type !== 'Video');
                      setQueue([track, ...nextAudioTracks] as any);
                    }
                  }}><FaPlay className="text-xs cursor-pointer" /></span>
                  <img
                    src={track.thumbnailUrl || "default-cover.png"}
                    alt="cover"
                    className="w-10 h-10 rounded shadow object-cover cursor-pointer"
                    onClick={() => {
                      if (track.type === 'Video') {
                        navigate(`/video/${track.id}`, { state: { videoData: track } });
                      } else {
                        const nextAudioTracks = likedSongs.slice(index + 1).filter(t => t.type !== 'Video');
                        setQueue([track, ...nextAudioTracks] as any);
                      }
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center min-w-0">
                      {track.type === 'Video' && <span className="mr-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold flex-shrink-0">VIDEO</span>}
                      <p className="font-medium text-white group-hover:text-spotify-primary transition-colors cursor-pointer truncate" onClick={() => {
                        if (track.type === 'Video') {
                          navigate(`/video/${track.id}`, { state: { videoData: track } });
                        } else {
                          const nextAudioTracks = likedSongs.slice(index + 1).filter(t => t.type !== 'Video');
                          setQueue([track, ...nextAudioTracks] as any);
                        }
                      }}>
                        {track.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {track.artistName || "Nghệ sĩ ẩn danh"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <FaHeart className="text-spotify-primary" title="Đã thích" />
                  <span className="text-sm text-gray-500 font-mono w-10 text-right">
                    {track.duration || "03:00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/40 rounded-xl p-8 text-center border border-zinc-800/50">
            <FaHeart className="text-4xl text-zinc-700 mx-auto mb-4" />
            <p className="text-white font-bold text-xl mb-2">
              Các bài hát bạn đã thích sẽ xuất hiện ở đây
            </p>
            <p className="text-gray-400 text-sm">
              Lưu bài hát bằng cách nhấn vào biểu tượng trái tim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
