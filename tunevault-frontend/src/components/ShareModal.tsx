import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface ShareModalProps {
    mediaId?: string;
    playlistId?: string;
    mediaTitle: string;
    onClose: () => void;
}

interface UserSearchDto {
    id: string;
    userName: string;
    displayName: string | null;
    avatarUrl: string | null;
    isArtist: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ mediaId, playlistId, mediaTitle, onClose }) => {
    const navigate = useNavigate();
    const [receiverUsername, setReceiverUsername] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    
    // State for suggestions
    const [suggestions, setSuggestions] = useState<UserSearchDto[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    // Xử lý click outside để đóng popup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (keyword: string) => {
        if (!keyword.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);
        try {
            const response = await api.get(`/Search/users?keyword=${keyword}`);
            if (response.data) {
                setSuggestions(response.data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm người dùng:', error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setReceiverUsername(value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (value.trim()) {
            typingTimeoutRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleShareAction = async (username: string) => {
        if (!username.trim()) {
            toast.warning('Vui lòng chọn người nhận!');
            return;
        }

        setIsSharing(true);
        try {
            const response = await api.post('/media/share', {
                receiverUsername: username,
                mediaItemId: mediaId || null,
                playlistId: playlistId || null
            });

            if (response.data?.success) {
                toast.success('Chia sẻ nhạc thành công! Đã báo SignalR cho đối tác 🚀');
                onClose(); // Đóng modal
            } else {
                toast.error(response.data?.message || 'Có lỗi xảy ra khi chia sẻ!');
            }
        } catch (error: unknown) {
            console.error('Lỗi share nhạc:', error);
            const errorMessage = (error as any).response?.data?.message || 'Không kết nối được server!';
            toast.error(errorMessage);
        } finally {
            setIsSharing(false);
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleShareAction(receiverUsername);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
            <div className="bg-spotify-base p-6 rounded-lg w-full max-w-md border border-white/10" ref={wrapperRef}>
                <h2 className="text-2xl font-bold text-white mb-2">Chia sẻ bài hát</h2>
                <p className="text-spotify-subtext mb-4">Đang chia sẻ: <span className="text-white font-semibold">{mediaTitle}</span></p>
                
                <form onSubmit={handleShare} className="relative">
                    <input
                        type="text"
                        placeholder="Nhập Username của người nhận..."
                        value={receiverUsername}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#1ed760] mb-4"
                        required
                    />
                    
                    {/* Popup gợi ý */}
                    {showSuggestions && (
                        <div className="absolute top-[52px] left-0 w-full bg-[#282828] rounded-md shadow-2xl max-h-60 overflow-y-auto z-50 border border-white/10">
                            {isLoadingSuggestions ? (
                                <div className="p-3 text-spotify-subtext text-center text-sm">Đang tìm kiếm...</div>
                            ) : suggestions.length > 0 ? (
                                <ul className="flex flex-col">
                                    {suggestions.map((user) => (
                                        <li key={user.id} className="flex items-center justify-between p-3 hover:bg-white/10 transition-colors group cursor-pointer"
                                            onClick={() => setReceiverUsername(user.userName)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center overflow-hidden flex-shrink-0 text-black font-bold">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.userName.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-sm line-clamp-1">{user.displayName || user.userName}</span>
                                                    <span className="text-spotify-subtext text-xs line-clamp-1">@{user.userName}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onClose();
                                                        // Tuỳ chỉnh đường dẫn profile nếu sau này bạn có làm /profile/:id
                                                        navigate(user.isArtist ? `/artist/${user.id}` : `/profile/${user.id}`);
                                                    }}
                                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium"
                                                >
                                                    Hồ sơ
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShareAction(user.userName);
                                                    }}
                                                    className="px-3 py-1 bg-[#1ed760] hover:scale-105 text-black rounded-full text-xs font-bold"
                                                >
                                                    Gửi liền
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-3 text-spotify-subtext text-center text-sm">Không tìm thấy người dùng</div>
                            )}
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 mt-2">
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