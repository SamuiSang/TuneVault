import { useState, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { useAuth } from '../contexts/AuthContext';
import { getSharedWithMe } from '../services/playlistService';
import { usePlayer } from '../hooks/usePlayer';
import { FiPlay } from 'react-icons/fi';

const ShareInbox = () => {
    const { user, token } = useAuth();
    
    // URL của Hub backend
    const hubUrl = 'http://localhost:5277/hubs/notifications';
    
    const connection = useSignalR(hubUrl, token || '');
    const [sharedItems, setSharedItems] = useState<any[]>([]);
    
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
                                <div className="relative w-12 h-12 bg-spotify-base flex items-center justify-center rounded overflow-hidden flex-shrink-0">
                                    {item.thumbnailUrl ? (
                                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <FiPlay className="text-2xl text-spotify-subtext group-hover:text-white transition-colors" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg cursor-pointer hover:underline" onClick={() => handlePlay(item)}>
                                        {item.title}
                                    </p>
                                    <p className="text-spotify-subtext text-sm">
                                        Từ: <span className="font-semibold text-white">{item.senderName}</span> • {new Date(item.sharedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handlePlay(item)}
                                className="px-4 py-2 bg-[#1ed760] text-black font-bold rounded-full text-sm hover:scale-105 transition opacity-0 group-hover:opacity-100"
                            >
                                Phát Nhạc
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShareInbox;