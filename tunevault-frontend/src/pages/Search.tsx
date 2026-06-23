import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  searchMedia,
  searchArtists,
  searchPlaylists
} from "../services/searchService";
// ---> BỔ SUNG CHO TUÂN: Import Modal Thêm Track <---
import AddTrackModal from "../components/AddTrackModal";
import { FiPlus, FiPlay } from "react-icons/fi";
import { PlayerContext } from "../contexts/PlayerContext";

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const player = useContext(PlayerContext);

  const [media, setMedia] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  // ---> BỔ SUNG CHO TUÂN: State quản lý modal thêm bài hát <---
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!keyword.trim()) {
        setMedia([]);
        setArtists([]);
        setPlaylists([]);
        return;
      }

      try {
        const [mediaRes, artistRes, playlistRes] = await Promise.all([
          searchMedia(keyword),
          searchArtists(keyword),
          searchPlaylists(keyword)
        ]);

        setMedia(mediaRes);
        setArtists(artistRes);
        setPlaylists(playlistRes);
      } catch (error) {
        console.error(error);
      }
    };

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [keyword]);

  return (
    <div className="p-6 text-white pb-24">
      {keyword ? (
        <h1 className="text-3xl font-bold mb-6">Kết quả cho "{keyword}"</h1>
      ) : (
        <h1 className="text-3xl font-bold mb-6">Tìm kiếm nội dung yêu thích của bạn</h1>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Media</h2>
          {media.length === 0 && <p className="text-spotify-subtext">Không có bài hát nào khớp.</p>}
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-4 rounded mb-2 flex justify-between items-center group hover:bg-zinc-700 transition-colors"
            >
              <div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-sm text-spotify-subtext">{item.artistName || 'Unknown Artist'}</p>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Nút Play */}
                <button 
                  onClick={() => {
                    const mappedItem = {
                      id: item.id || item.Id,
                      title: item.title || item.Title,
                      thumbnailUrl: item.thumbnailUrl || item.ThumbnailUrl,
                      ownerId: item.artistName || item.ArtistName || 'Unknown',
                      type: 'Audio',
                      duration: item.duration || item.Duration || 0,
                      filePath: ''
                    };
                    void player?.playTrack(mappedItem as any);
                  }}
                  className="bg-[#1ed760] text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  title="Phát nhạc"
                >
                  <FiPlay className="text-lg ml-0.5" />
                </button>

                {/* ---> BỔ SUNG CHO TUÂN: Nút gọi Modal <--- */}
                <button 
                  onClick={() => setSelectedMediaId(item.id)}
                  className="text-spotify-subtext hover:text-white border border-spotify-subtext hover:border-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                  title="Thêm vào Playlist"
                >
                  <FiPlus className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Artists</h2>
          {artists.length === 0 && <p className="text-spotify-subtext">Không có nghệ sĩ nào khớp.</p>}
          {artists.map((artist) => (
            <Link key={artist.id} to={`/artist/${artist.id}`} className="block">
              <div className="bg-zinc-800 p-4 rounded mb-2 font-bold hover:bg-zinc-700">
                {artist.name}
              </div>
            </Link>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Playlists</h2>
          {playlists.length === 0 && <p className="text-spotify-subtext">Không có playlist nào khớp.</p>}
          {playlists.map((playlist) => (
            <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="block">
              <div className="bg-zinc-800 p-4 rounded mb-2 font-bold hover:bg-zinc-700">
                {playlist.name}
              </div>
            </Link>
          ))}
        </section>
      </div>

      {/* ---> BỔ SUNG CHO TUÂN: Render Modal Thêm bài hát <--- */}
      {selectedMediaId && (
        <AddTrackModal mediaId={selectedMediaId} onClose={() => setSelectedMediaId(null)} />
      )}
    </div>
  );
}