import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistDetail } from "../services/playlistService";

type Track = {
  id: string;
  title: string;
  artistName?: string;
  duration?: string;
};

type PlaylistDetail = {
  id: string;
  name: string;
  description?: string;
  tracks?: Track[];
};

export default function Playlist() {
  const { id } = useParams();

  const [playlist, setPlaylist] =
    useState<PlaylistDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadPlaylist(id);
    }
  }, [id]);

  const loadPlaylist = async (
    playlistId: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPlaylistDetail(playlistId);

      setPlaylist(data);
    } catch (err) {
      console.error(err);
      setError(
        "Không thể tải thông tin playlist."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <p>Loading playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 text-white">
        Playlist not found.
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {playlist.name}
        </h1>

        <p className="text-gray-400">
          {playlist.description ||
            "No description available"}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          {playlist.tracks?.length || 0} tracks
        </p>
      </div>

      {playlist.tracks &&
      playlist.tracks.length > 0 ? (
        <div className="space-y-3">
          {playlist.tracks.map(
            (track, index) => (
              <div
                key={track.id}
                className="
                  flex
                  items-center
                  justify-between
                  bg-zinc-800
                  hover:bg-zinc-700
                  transition
                  rounded-lg
                  p-4
                "
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {track.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    {track.artistName ||
                      "Unknown Artist"}
                  </p>
                </div>

                <span className="text-sm text-gray-400">
                  {track.duration || "--:--"}
                </span>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Playlist trống
          </h2>

          <p className="text-gray-400">
            Chưa có bài hát nào trong playlist.
          </p>
        </div>
      )}
    </div>
  );
}