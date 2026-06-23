import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserPlaylists, addTrackToPlaylist } from '../services/playlistService';
import { useAuth } from '../contexts/AuthContext';

// ---> BỔ SUNG CHO TUÂN: Modal Thêm Bài Hát Vào Playlist <---
interface AddTrackModalProps {
    mediaId: string;
    onClose: () => void;
}

const AddTrackModal: React.FC<AddTrackModalProps> = ({ mediaId, onClose }) => {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPlaylists = async () => {
            const userId = user?.id;
            if (!userId) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await getUserPlaylists(userId);
                setPlaylists(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi lấy danh sách playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlaylists();
    }, [user?.id]);

    const handleAddToPlaylist = async (playlistId: string) => {
        try {
            await addTrackToPlaylist(playlistId, mediaId);
            toast.success('Đã thêm vào Playlist!');
            onClose();
        } catch (error) {
            console.error('Lỗi thêm bài hát:', error);
            toast.error('Bài hát đã có trong Playlist hoặc có lỗi xảy ra.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-spotify-elevated p-6 rounded-lg w-full max-w-md border border-white/10">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white">Thêm vào Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-xl">&times;</button>
                </div>

                {isLoading ? (
                    <div className="text-center text-spotify-subtext py-4">Đang tải...</div>
                ) : playlists.length === 0 ? (
                    <div className="text-center text-spotify-subtext py-4">Bạn chưa có Playlist nào.</div>
                ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {playlists.map((pl) => (
                            <li 
                                key={pl.id} 
                                onClick={() => handleAddToPlaylist(pl.id)}
                                className="p-3 bg-white/5 rounded cursor-pointer hover:bg-white/10 text-white font-semibold transition-colors flex justify-between items-center"
                            >
                                <span>{pl.name}</span>
                                <span className="text-sm font-normal text-spotify-subtext">{pl.totalTracks || 0} bài</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddTrackModal;