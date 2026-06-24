import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { mediaService } from "../services/mediaService";
import type { MediaItem } from "../types";
import AddTrackModal from "../components/AddTrackModal";
import { albumService, type Album } from "../services/albumService";
import { useNavigate } from "react-router-dom";
import FollowButton from "../components/layout/FollowButton";
import api from "../services/api";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const ArtistProfile = () => {
  const { user } = useAuth();
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { setQueue } = usePlayer();
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (artistId) {
      const fetchArtistTracks = async () => {
        try {
          const [allMedia, artistAlbums, profileRes] = await Promise.all([
            mediaService.getAllMedia(),
            albumService.getAlbumsByArtistId(artistId),
            api.get(`/auth/profile/${artistId}`).catch(() => ({ data: null }))
          ]);
          // Lọc danh sách bài hát có ownerId trùng với nghệ sĩ được ấn
          const artistTracks = allMedia.filter(item => item.ownerId === artistId);
          setTracks(artistTracks);
          setAlbums(artistAlbums);
          if (profileRes.data) {
            setArtistInfo(profileRes.data);
          }
        } catch (err) {
          console.error("Lỗi khi tải nhạc nghệ sĩ:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchArtistTracks();
    }
  }, [artistId]);

  if (loading) return <div className="text-white p-6">Đang tải nhạc nghệ sĩ...</div>;

  const artistName = artistInfo?.displayName || artistInfo?.userName || (tracks.length > 0 && tracks[0].ownerName ? tracks[0].ownerName : artistId);

  return (
    <div className="text-white p-6 pb-24">
      <div className="mb-8 p-8 bg-gradient-to-r from-teal-800 to-zinc-900 rounded-lg relative group flex items-end gap-6">
        {/* Avatar */}
        <div className="w-48 h-48 bg-spotify-highlight rounded-full overflow-hidden flex items-center justify-center text-7xl font-bold shadow-2xl">
          {artistInfo?.avatarUrl ? (
            <img src={artistInfo.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            artistName?.charAt(0).toUpperCase() || 'A'
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider">Nghệ sĩ</p>
          <h1 className="text-5xl font-black mt-2 mb-4">{artistName || "Thông tin nghệ sĩ"}</h1>
          
          <div className="flex items-center gap-4 mt-6">
            {tracks.filter(t => t.type !== 'Video').length > 0 && (
              <button
                onClick={() => {
                  const audioTracks = tracks.filter(t => t.type !== 'Video');
                  setQueue(audioTracks);
                }}
                className="w-14 h-14 bg-[#1ed760] rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-all"
                title="Phát tất cả bài hát"
              >
                <FaPlay className="ml-1 text-2xl" />
              </button>
            )}
            {artistId && user?.id !== artistId && (
               <FollowButton 
                 targetId={artistId} 
                 className="px-6 py-2 rounded-full font-bold transition-all border shadow-lg hover:scale-105 bg-transparent text-white border-white hover:bg-white/10" 
               />
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Bài hát phổ biến</h2>
      <div className="flex flex-col gap-1">
        {tracks.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Nghệ sĩ này chưa có bài hát nào.</p>
        ) : (
          tracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                if (track.type === 'Video') {
                  navigate(`/video/${track.id}`, { state: { videoData: track } });
                } else {
                  const nextAudioTracks = tracks.slice(index + 1).filter(t => t.type !== 'Video');
                  setQueue([track, ...nextAudioTracks]);
                }
              }}
              className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-md cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-4 w-[60%]">
                <span className="text-gray-400 w-5 text-center group-hover:hidden">{index + 1}</span>
                <span className="text-white w-5 text-center hidden group-hover:flex items-center justify-center"><FaPlay className="text-xs" /></span>
                <img 
                  src={track.thumbnailUrl || "default-cover.png"} 
                  alt={track.title} 
                  className="w-10 h-10 object-cover rounded shadow"
                />
                <div className="flex items-center min-w-0 flex-1">
                  {track.type === 'Video' && <span className="mr-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold flex-shrink-0">VIDEO</span>}
                  <span className="font-medium truncate">{track.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedMediaId(track.id); setIsAddModalOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 text-spotify-subtext hover:text-white transition-all text-xl px-2"
                  title="Thêm vào Playlist"
                >
                  +
                </button>
                <span className="text-sm text-gray-400">{track.duration || "03:45"}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Album Section */}
      {albums.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {albums.map((album) => (
              <div 
                key={album.id}
                onClick={() => navigate(`/album/${album.id}`)}
                className="bg-spotify-card hover:bg-spotify-card-hover p-4 rounded-md transition-all duration-300 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img 
                    src={album.coverImageUrl || 'default-cover.png'} 
                    alt={album.title} 
                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                  />
                </div>
                <h3 className="font-bold text-[16px] mb-1 line-clamp-1">{album.title}</h3>
                <p className="text-sm text-spotify-subtext">
                  {new Date(album.releaseDate).getFullYear()} • Album
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAddModalOpen && selectedMediaId && (
        <AddTrackModal
          mediaId={selectedMediaId}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedMediaId(null);
          }}
        />
      )}
    </div>
  );
};

export default ArtistProfile;