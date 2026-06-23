import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistDetail, removeTrackFromPlaylist, addTrackToPlaylist, deletePlaylist } from "../services/playlistService";
import { mediaService } from "../services/mediaService";
import { toast } from 'react-toastify'; 
import { FiTrash2, FiPlus, FiMusic } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import { usePlayer } from '../hooks/usePlayer';

type Track = {
  id: string;
  title: string; 
  artistName?: string;
  duration?: string;
  coverImageUrl?: string;
};

type PlaylistDetail = {
  id: string;
  name: string;
  description?: string;
  userId?: string;     
  isPrivate?: boolean;  
  tracks?: Track[];
};

export default function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setQueue } = usePlayer();

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  const currentUserId = localStorage.getItem("userId") || "user-current-id";

  useEffect(() => {
    if (id) {
      loadPlaylist(id);
    }
  }, [id]);

  const loadPlaylist = async (playlistId: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await getPlaylistDetail(playlistId);
      setPlaylist(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin playlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (mediaId: string) => {
    if (!id) return;
    try {
      await removeTrackFromPlaylist(id, mediaId);
      toast.success("Đã xóa bài hát khỏi playlist!");
      window.dispatchEvent(new Event('playlist_updated')); // Báo Sidebar cập nhật
      loadPlaylist(id); 
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa bài hát!");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id || !playlist) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh sách phát "${playlist.name}" không?`)) {
      try {
        await deletePlaylist(id);
        toast.success("Đã xóa Playlist thành công!");
        navigate("/"); 
      } catch (err) {
        console.error(err);
        toast.error("Lỗi hệ thống hoặc bạn không có quyền xóa playlist này!");
      }
    }
  };

  const handleSearchTracks = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const allTracks = await mediaService.getAllMedia();
      const filtered = (allTracks as any[]).filter(track => 
        track.title?.toLowerCase().includes(query.toLowerCase()) ||
        track.artistName?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm bài hát:", err);
    }
  };

  const handleAddTrack = async (mediaId: string) => {
    if (!id) return;
    try {
      await addTrackToPlaylist(id, mediaId);
      toast.success("Đã thêm bài hát vào danh sách phát!");
      setSearchQuery(""); 
      setSearchResults([]);
      window.dispatchEvent(new Event('playlist_updated')); // Báo Sidebar cập nhật
      loadPlaylist(id); 
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm bài hát này!");
    }
  };

  const handlePlayPlaylist = () => {
    if (playlist?.tracks && playlist.tracks.length > 0) {
      setQueue(playlist.tracks as any);
    } else {
      toast.warning("Playlist chưa có bài hát nào!");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white animate-pulse">
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

  const isOwner = playlist.userId ? playlist.userId === currentUserId : true;

  return (
    <div className="p-6 text-white pb-24">
      <div className="mb-8 flex items-end gap-6 bg-gradient-to-b from-zinc-800 to-transparent p-6 rounded-xl">
        <div className="w-40 h-40 bg-zinc-800 flex items-center justify-center rounded-lg shadow-2xl border border-zinc-700">
          <FiMusic className="text-5xl text-zinc-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 tracking-wider">
            <span>Playlist</span>
            <span>•</span>
            <span className="text-zinc-500">
              {playlist.isPrivate ? "Riêng tư" : "Công khai"}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold my-2 text-white">
            {playlist.name}
          </h1>
          <p className="text-gray-400 text-sm">
            {playlist.description || "Chưa có mô tả cho danh sách phát này."}
          </p>
          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={handlePlayPlaylist}
              className="w-14 h-14 bg-spotify-primary rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-all"
              title="Phát Playlist"
            >
              <FaPlay className="ml-1 text-2xl" />
            </button>
            <p className="text-xs text-gray-500 font-bold">
              {playlist.tracks?.length || 0} BÀI HÁT
            </p>
            {isOwner && (
              <button 
                onClick={handleDeletePlaylist}
                className="text-xs text-red-500 hover:text-red-400 font-bold border border-red-500/30 hover:border-red-500 px-3 py-1.5 rounded-full transition-all ml-auto"
              >
                Xóa danh sách này
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Bài hát trong danh sách</h2>
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="space-y-2">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-zinc-900/60 hover:bg-zinc-800/80 transition rounded-lg p-4 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-4 text-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white group-hover:text-spotify-primary transition-colors">
                      {track.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {track.artistName || "Nghệ sĩ ẩn danh"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 font-mono">
                    {track.duration || "03:45"}
                  </span>
                  {isOwner && (
                    <button 
                      onClick={() => handleRemoveTrack(track.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-1.5 transition-all"
                      title="Xóa khỏi Playlist"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/40 rounded-xl p-8 text-center border border-zinc-800/50">
            <p className="text-gray-400 text-sm italic">
              Danh sách phát này hiện đang trống. Hãy tìm kiếm thêm bài hát ở khung bên dưới!
            </p>
          </div>
        )}
      </div>

      <hr className="border-zinc-800/80 mb-8" />

      {isOwner && (
        <section className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl">
          <h3 className="font-bold mb-2 text-base text-white">
            Hãy tìm thêm nội dung cho danh sách phát của bạn
          </h3>
          <p className="text-xs text-gray-400 mb-4">Gõ tên bài hát hoặc nghệ sĩ để tìm kiếm nhanh</p>
          
          <input
            type="text"
            placeholder="Tìm kiếm bài hát cần thêm..."
            value={searchQuery}
            onChange={(e) => handleSearchTracks(e.target.value)}
            className="w-full max-w-md bg-zinc-800 text-white p-3 px-5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 mb-4 placeholder-gray-500"
          />

          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-zinc-800/60 max-w-xl">
              {searchResults.map((track) => (
                <div key={track.id} className="flex justify-between items-center p-2.5 hover:bg-zinc-800/50 rounded-md transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-white">{track.title}</p>
                    <p className="text-xs text-gray-400">{track.artistName}</p>
                  </div>
                  <button 
                    onClick={() => handleAddTrack(track.id)} 
                    className="border border-zinc-500 hover:border-white text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all hover:scale-105"
                  >
                    <FiPlus size={12} /> Thêm
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}