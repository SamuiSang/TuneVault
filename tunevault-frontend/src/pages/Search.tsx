import { useState } from "react";
import {
  searchMedia,
  searchArtists,
  searchPlaylists
} from "../services/searchService";

export default function Search() {
  const [keyword, setKeyword] = useState("");

  const [media, setMedia] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

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
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search songs, artists, playlists..."
          className="flex-1 p-3 rounded bg-zinc-800"
        />

        <button
          onClick={handleSearch}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-2">Media</h2>

          {media.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800 p-3 rounded mb-2"
            >
              {item.title}
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Artists</h2>

          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-zinc-800 p-3 rounded mb-2"
            >
              {artist.name}
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Playlists</h2>

          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-zinc-800 p-3 rounded mb-2"
            >
              {playlist.name}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}