import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

interface ShareModalProps {
    mediaId: string;
    mediaTitle: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ mediaId, mediaTitle, onClose }) => {
    const [receiverId, setReceiverId] = useState('');
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverId.trim()) {
            toast.warning('Vui lòng nhập ID người nhận!');
            return;
        }

        setIsSharing(true);

        try {
            const response = await api.post('/media/share', {
                receiverId,
                mediaItemId: mediaId
            });

            if (response.data?.success) {
                toast.success('Chia sẻ nhạc thành công! Đã báo SignalR cho đối tác 🚀');
                onClose(); // Đóng modal
            } else {
                toast.error(response.data?.message || 'Có lỗi xảy ra khi chia sẻ!');
            }
        } catch (error) {
            console.error('Lỗi share nhạc:', error);
            toast.error('Không kết nối được server!');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-spotify-base p-6 rounded-lg w-full max-w-md border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-2">Chia sẻ bài hát</h2>
                <p className="text-spotify-subtext mb-4">Đang chia sẻ: <span className="text-white font-semibold">{mediaTitle}</span></p>
                
                <form onSubmit={handleShare}>
                    <input
                        type="text"
                        placeholder="Nhập User ID của người nhận..."
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
                        className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#1ed760] mb-4"
                        required
                    />
                    
                    <div className="flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-full font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            disabled={isSharing}
                            className="px-4 py-2 bg-[#1ed760] text-black rounded-full font-bold hover:scale-105 transition-transform disabled:bg-gray-500"
                        >
                            {isSharing ? 'Đang gửi...' : 'Gửi liền'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareModal;