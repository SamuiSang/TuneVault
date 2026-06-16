import { useState } from "react";
import {
  searchMedia,
  searchArtists,
  searchPlaylists
} from "../services/searchService";
// ---> BỔ SUNG CHO TUÂN: Import Modal Thêm Track <---
import AddTrackModal from "../components/AddTrackModal";
import { FiPlus } from "react-icons/fi";

export default function Search() {
  const [keyword, setKeyword] = useState("");

  const [media, setMedia] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  // ---> BỔ SUNG CHO TUÂN: State quản lý modal thêm bài hát <---
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

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

  return (
    <div className="p-6 text-white pb-24">
      <h1 className="text-3xl font-bold mb-4">Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search songs, artists, playlists..."
          className="flex-1 p-3 rounded bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#1ed760]"
        />

        <button
          onClick={handleSearch}
          className="bg-green-500 px-6 py-2 rounded text-black font-bold hover:scale-105 transition-transform"
        >
          Search
        </button>
      </div>

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
              
              {/* ---> BỔ SUNG CHO TUÂN: Nút gọi Modal <--- */}
              <button 
                onClick={() => setSelectedMediaId(item.id)}
                className="opacity-0 group-hover:opacity-100 bg-[#1ed760] text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                title="Thêm vào Playlist"
              >
                <FiPlus className="text-xl" />
              </button>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Artists</h2>
          {artists.length === 0 && <p className="text-spotify-subtext">Không có nghệ sĩ nào khớp.</p>}
          {artists.map((artist) => (
            <div key={artist.id} className="bg-zinc-800 p-4 rounded mb-2 font-bold hover:bg-zinc-700">
              {artist.name}
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Playlists</h2>
          {playlists.length === 0 && <p className="text-spotify-subtext">Không có playlist nào khớp.</p>}
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-zinc-800 p-4 rounded mb-2 font-bold hover:bg-zinc-700">
              {playlist.name}
            </div>
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