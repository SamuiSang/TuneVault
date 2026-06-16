import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';

const ShareInbox = () => {
    // Tạm lấy token từ localStorage để test (sau này ráp với AuthContext của Thành)
    const token = localStorage.getItem('token') || '';
    
    // URL của Hub backend, bồ nhớ check lại port 5000 hay port khác nhé
    const hubUrl = 'http://localhost:5277/hubs/notifications';

    const connection = useSignalR(hubUrl, token);
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        if (connection) {
            // Lắng nghe sự kiện từ Backend
            connection.on('ReceiveNotification', (message: string) => {
                console.log("Có thông báo mới:", message);
                setNotifications(prev => [message, ...prev]);
                toast.info(`🎵 ${message}`);
            });
        }

        // Cleanup function
        return () => {
            if (connection) {
                connection.off('ReceiveNotification');
            }
        };
    }, [connection]);

    return (
        <div className="text-spotify-text">
            <h1 className="text-2xl font-bold mb-4">ShareInbox</h1>
            
            {notifications.length === 0 ? (
                <p className="text-spotify-subtext">Nội dung khám phá sẽ nằm ở đây...</p>
            ) : (
                <ul className="space-y-3 mt-4">
                    {notifications.map((note, index) => (
                        <li 
                            key={index} 
                            // Thêm chút background tối cho từng thông báo để nổi bật trên nền
                            className="p-3 bg-white/5 rounded-md border border-white/10"
                        >
                            {note}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShareInbox;