import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createPlaylist } from '../services/playlistService';

// ---> BỔ SUNG CHO TUÂN: Modal Tạo Playlist Mới <---
interface CreatePlaylistModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.warning('Vui lòng nhập tên playlist!');
            return;
        }

        setIsLoading(true);
        const ownerId = localStorage.getItem('userId') || '';

        try {
            // Ép kiểu payload do backend yêu cầu OwnerId và IsPublic
            await createPlaylist({
                name,
                description, // Frontend hỗ trợ thêm description nếu cần
                isPublic,
                ownerId
            } as any);

            toast.success('Tạo Playlist thành công!');
            onSuccess();
        } catch (error) {
            console.error('Lỗi tạo playlist:', error);
            toast.error('Có lỗi xảy ra khi tạo Playlist!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-spotify-elevated p-6 rounded-lg w-full max-w-md border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Tạo Playlist mới</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Tên Playlist</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#1ed760]"
                            placeholder="Nhập tên playlist..."
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Mô tả</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#1ed760] resize-none"
                            placeholder="Viết mô tả..."
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-spotify-subtext">
                        <input 
                            type="checkbox" 
                            id="isPublic"
                            checked={isPublic} 
                            onChange={(e) => setIsPublic(e.target.checked)} 
                            className="w-4 h-4 accent-[#1ed760]"
                        />
                        <label htmlFor="isPublic">Công khai Playlist này</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-white hover:text-gray-300">
                            Hủy
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#1ed760] text-black rounded-full font-bold hover:scale-105 disabled:bg-gray-500">
                            {isLoading ? 'Đang tạo...' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;