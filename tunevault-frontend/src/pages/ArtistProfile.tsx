import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { mediaService } from "../services/mediaService";
import type { MediaItem } from "../types";
import AddTrackModal from "../components/AddTrackModal";
import { albumService, type Album } from "../services/albumService";
import { useNavigate } from "react-router-dom";

const ArtistProfile = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { setQueue } = usePlayer();
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (artistId) {
      const fetchArtistTracks = async () => {
        try {
          const [allMedia, artistAlbums] = await Promise.all([
            mediaService.getAllMedia(),
            albumService.getAlbumsByArtistId(artistId)
          ]);
          // Lọc danh sách bài hát có ownerId trùng với nghệ sĩ được ấn
          const artistTracks = allMedia.filter(item => item.ownerId === artistId);
          setTracks(artistTracks);
          setAlbums(artistAlbums);
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

  const artistName = tracks.length > 0 && tracks[0].ownerName ? tracks[0].ownerName : artistId;

  return (
    <div className="text-white p-6 pb-24">
      <div className="mb-8 p-8 bg-gradient-to-r from-teal-800 to-zinc-900 rounded-lg relative group">
        <p className="text-xs font-bold uppercase tracking-wider">Nghệ sĩ</p>
        <h1 className="text-5xl font-black mt-2 mb-4">{artistName || "Thông tin nghệ sĩ"}</h1>
        <button 
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-6 py-2 rounded-full font-bold transition-all border shadow-lg hover:scale-105 ${isFollowing ? 'bg-transparent text-white border-white' : 'bg-white text-black border-transparent'}`}
        >
          {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Bài hát phổ biến</h2>
      <div className="flex flex-col gap-1">
        {tracks.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Nghệ sĩ này chưa có bài hát nào.</p>
        ) : (
          tracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => setQueue([track])}
              className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-md cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-4 w-[60%]">
                <span className="text-gray-400 w-5 text-center">{index + 1}</span>
                <img 
                  src={track.thumbnailUrl || "default-cover.png"} 
                  alt={track.title} 
                  className="w-10 h-10 object-cover rounded shadow"
                />
                <span className="font-medium truncate">{track.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedMediaId(track.id); setIsAddModalOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 text-spotify-subtext hover:text-white transition-all text-xl px-2"
                  title="Thêm vào Playlist"
                >
                  +
                </button>
                <span className="text-sm text-gray-400">03:45</span>
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