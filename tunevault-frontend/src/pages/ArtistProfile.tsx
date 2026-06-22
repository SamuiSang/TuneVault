import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { mediaService } from "../services/mediaService";
import type { MediaItem } from "../types";

const ArtistProfile = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { setQueue } = usePlayer();
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (artistId) {
      const fetchArtistTracks = async () => {
        try {
          const allMedia = await mediaService.getAllMedia();
          // Lọc danh sách bài hát có ownerId trùng với nghệ sĩ được ấn
          const artistTracks = allMedia.filter(item => item.ownerId === artistId);
          setTracks(artistTracks);
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

  return (
    <div className="text-white p-6 pb-24">
      <div className="mb-8 p-8 bg-gradient-to-r from-teal-800 to-zinc-900 rounded-lg">
        <p className="text-xs font-bold uppercase tracking-wider">Nghệ sĩ</p>
        <h1 className="text-5xl font-black mt-2 mb-4">{artistId || "Thông tin nghệ sĩ"}</h1>
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
              <span className="text-sm text-gray-400">03:45</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;