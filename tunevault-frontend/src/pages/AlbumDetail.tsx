import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { albumService, type AlbumDetail } from "../services/albumService";
import type { MediaItem } from "../types";
import { FaPlay, FaHeart, FaEllipsisH } from "react-icons/fa";

const AlbumDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTrack, setQueue } = usePlayer();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchAlbum = async () => {
        try {
          const data = await albumService.getAlbumById(id);
          setAlbum(data);
        } catch (err) {
          console.error("Lỗi khi tải thông tin album:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAlbum();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-spotify-text">
        <p className="animate-pulse">Đang tải album...</p>
      </div>
    );
  }

  if (!album) {
    return <div className="text-white p-6">Không tìm thấy album.</div>;
  }

  const tracks: MediaItem[] = album.tracks.map((t) => ({
    id: t.id,
    title: t.title,
    thumbnailUrl: t.thumbnailUrl,
    type: t.type as "Audio" | "Video",
    duration: t.duration,
    filePath: t.filePath,
    ownerId: t.ownerId,
    ownerName: t.ownerName
  }));

  const totalDuration = tracks.reduce((acc, curr) => acc + curr.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks);
    }
  };

  const handlePlayTrack = (track: MediaItem) => {
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    if (trackIndex !== -1) {
      const queueTracks = [...tracks.slice(trackIndex), ...tracks.slice(0, trackIndex)];
      setQueue(queueTracks);
    }
  };

  return (
    <div className="text-white pb-24">
      {/* Header */}
      <div className="flex items-end gap-6 p-6 md:p-8 bg-gradient-to-b from-teal-800 to-spotify-base">
        <img
          src={album.coverImageUrl || "default-cover.png"}
          alt={album.title}
          className="w-48 h-48 md:w-60 md:h-60 object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded"
        />
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-wider">Album</p>
          <h1 className="text-4xl md:text-6xl font-black mb-2 md:mb-4 tracking-tighter">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-spotify-text font-medium">
            <span className="text-white hover:underline cursor-pointer">{album.artistName || "Unknown Artist"}</span>
            <span>•</span>
            <span>{new Date(album.releaseDate).getFullYear()}</span>
            <span>•</span>
            <span>{tracks.length} bài hát, {totalMinutes} phút</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex items-center gap-6">
        <button 
          onClick={handlePlayAll}
          className="w-14 h-14 bg-spotify-primary text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <FaPlay className="text-2xl ml-1" />
        </button>
        <button className="text-spotify-subtext hover:text-white text-3xl">
          <FaHeart />
        </button>
        <button className="text-spotify-subtext hover:text-white text-2xl">
          <FaEllipsisH />
        </button>
      </div>

      {/* Track List */}
      <div className="px-6">
        {tracks.length === 0 ? (
          <p className="text-spotify-subtext">Album này chưa có bài hát nào.</p>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer group transition-all ${currentTrack?.id === track.id ? 'bg-zinc-800' : 'hover:bg-neutral-800'}`}
              >
                <div className="flex items-center gap-4 w-[60%]">
                  <span className="text-gray-400 w-5 text-center font-medium">
                    {currentTrack?.id === track.id ? (
                      <FaPlay className="text-spotify-primary text-xs mx-auto" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <span className={`font-medium truncate block ${currentTrack?.id === track.id ? 'text-spotify-primary' : 'text-white'}`}>{track.title}</span>
                    <span className="text-sm text-spotify-subtext block">{track.ownerName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-mono">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetailView;
