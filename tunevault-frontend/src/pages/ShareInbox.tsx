import { useState, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { useAuth } from '../contexts/AuthContext';
import { getSharedWithMe, deleteSharedItems } from '../services/playlistService';
import { usePlayer } from '../hooks/usePlayer';
import { FiPlay, FiTrash2 } from 'react-icons/fi';

const ShareInbox = () => {
    const { user, token } = useAuth();
    
    // URL của Hub backend
    const hubUrl = 'http://localhost:5277/hubs/notifications';
    
    const connection = useSignalR(hubUrl, token || '');
    const [sharedItems, setSharedItems] = useState<any[]>([]);
    
    // Thêm state cho tính năng chọn và xóa
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { playTrack } = usePlayer();

    const fetchSharedMedia = async () => {
        if (user?.id) {
            try {
                const res = await getSharedWithMe(user.id);
                if (res.success && res.data) {
                    setSharedItems(res.data);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách nhạc chia sẻ:", err);
            }
        }
    };

    useEffect(() => {
        fetchSharedMedia();
        // eslint-disable-next-react-hooks/exhaustive-deps
    }, [user?.id]);

    useEffect(() => {
        if (connection) {
            // Lắng nghe sự kiện từ Backend để update lại danh sách UI
            connection.on('ReceiveNotification', () => {
                // Fetch lại danh sách giúp đồng bộ DB và hiển thị đủ thuộc tính
                fetchSharedMedia();
            });
        }
        
        // Cleanup function
        return () => {
            if (connection) {
                connection.off('ReceiveNotification');
            }
        };
    }, [connection, user?.id]);

    const handlePlay = (item: any) => {
        // Trong chế độ chọn thì vô hiệu hóa bấm phát nhạc
        if (isSelectionMode) return;

        playTrack({
            id: item.mediaId,
            title: item.title,
            type: item.type,
            duration: 0, // Mock duration
            filePath: item.filePath,
            thumbnailUrl: item.thumbnailUrl,
            ownerId: item.senderName // Mượn tạm trường ownerId để hiển thị "Nghệ sĩ" (người share)
        });
    };

    const toggleSelection = (shareId: string) => {
        if (selectedIds.includes(shareId)) {
            setSelectedIds(selectedIds.filter(id => id !== shareId));
        } else {
            setSelectedIds([...selectedIds, shareId]);
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            // Nếu chưa chọn gì mà bấm xóa thì thoát chế độ chọn
            setIsSelectionMode(false);
            return;
        }

        try {
            setIsDeleting(true);
            await deleteSharedItems(selectedIds);
            
            // Xóa thành công thì load lại danh sách, reset state
            await fetchSharedMedia();
            setSelectedIds([]);
            setIsSelectionMode(false);
        } catch (err) {
            console.error("Lỗi xóa bài hát chia sẻ:", err);
            alert("Có lỗi xảy ra khi xóa.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="text-spotify-text">
            <h1 className="text-2xl font-bold mb-6 text-white">Share Inbox</h1>
            {sharedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-spotify-subtext">
                    <p>Hộp thư trống.</p>
                    <p className="text-sm">Nội dung bạn bè chia sẻ sẽ nằm ở đây...</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {sharedItems.map((item, index) => (
                        <li 
                            key={item.shareId || index}
                            className="p-4 bg-white/5 rounded-md border border-transparent hover:bg-white/10 hover:border-white/10 transition flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                {isSelectionMode && (
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 ml-2 accent-[#1ed760] cursor-pointer shrink-0"
                                        checked={selectedIds.includes(item.shareId)}
                                        onChange={() => toggleSelection(item.shareId)}
                                    />
                                )}
                                <div 
                                    className="relative w-12 h-12 bg-spotify-base flex items-center justify-center rounded overflow-hidden flex-shrink-0 cursor-pointer"
                                    onClick={() => isSelectionMode ? toggleSelection(item.shareId) : handlePlay(item)}
                                >
                                    {item.thumbnailUrl ? (
                                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <FiPlay className="text-2xl text-spotify-subtext group-hover:text-white transition-colors" />
                                    )}
                                </div>
                                <div 
                                    className={isSelectionMode ? "cursor-pointer" : ""} 
                                    onClick={() => isSelectionMode && toggleSelection(item.shareId)}
                                >
                                    <p className={`text-white font-bold text-lg ${!isSelectionMode && 'cursor-pointer hover:underline'}`} onClick={() => !isSelectionMode && handlePlay(item)}>
                                        {item.title}
                                    </p>
                                    <p className="text-spotify-subtext text-sm">
                                        Từ: <span className="font-semibold text-white">{item.senderName}</span> • {new Date(item.sharedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {!isSelectionMode && (
                                <button 
                                    onClick={() => handlePlay(item)}
                                    className="px-4 py-2 bg-[#1ed760] text-black font-bold rounded-full text-sm hover:scale-105 transition opacity-0 group-hover:opacity-100"
                                >
                                    Phát Nhạc
                                </button>
                            )}
                        </li>
                    ))}
                    
                    {/* Nút Xóa danh sách nằm dưới cùng */}
                    <div className="mt-8 flex justify-end">
                        {isSelectionMode ? (
                            <div className="flex gap-4 items-center">
                                <span className="text-sm text-gray-400">Đã chọn: {selectedIds.length} mục</span>
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(false);
                                        setSelectedIds([]);
                                    }}
                                    className="px-6 py-2 bg-transparent text-white border border-white font-bold rounded-full hover:bg-white hover:text-black transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`px-6 py-2 bg-red-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-red-600 transition ${isDeleting && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <FiTrash2 />
                                    {selectedIds.length > 0 ? (isDeleting ? "Đang xóa..." : "Xóa đã chọn") : "Xong"}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsSelectionMode(true)}
                                className="px-6 py-2 bg-transparent border border-gray-500 text-gray-300 font-bold rounded-full hover:border-white hover:text-white transition flex items-center gap-2"
                            >
                                <FiTrash2 />
                                Xóa bớt danh sách
                            </button>
                        )}
                    </div>
                </ul>
            )}
        </div>
    );
};

export default ShareInbox;