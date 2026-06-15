import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPlaylists } from "../services/playlistService";

type Playlist = {
  id: string;
  name: string;
  description?: string;
};

export default function Library() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("Không tìm thấy thông tin người dùng.");
        return;
      }

      const data = await getUserPlaylists(userId);

      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách playlist.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">
          Your Library
        </h1>

        <p className="text-gray-400">
          Đang tải playlist...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">
          Your Library
        </h1>

        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Your Library
        </h1>

        <span className="text-sm text-gray-400">
          {playlists.length} playlist(s)
        </span>
      </div>

      {playlists.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Chưa có playlist nào
          </h2>

          <p className="text-gray-400">
            Hãy tạo playlist đầu tiên của bạn.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-5
          "
        >
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="
                bg-zinc-800
                hover:bg-zinc-700
                transition-all
                duration-200
                rounded-xl
                p-5
                shadow-md
                hover:scale-[1.02]
              "
            >
              <div className="w-full h-32 bg-zinc-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>

              <h3 className="font-bold text-lg mb-2 truncate">
                {playlist.name}
              </h3>

              <p className="text-sm text-gray-400 line-clamp-3">
                {playlist.description ||
                  "No description available"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}