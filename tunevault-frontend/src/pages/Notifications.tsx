import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface NotificationItem {
    id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Lấy userId từ localStorage
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    setIsLoading(false);
                    return;
                }
                const response = await fetch('http://localhost:5277/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông báo:', error);
                toast.error('Không thể tải danh sách thông báo');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="p-8 text-spotify-text max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                <FiBell /> Thông báo của bạn
            </h1>

            {isLoading ? (
                <div className="text-center text-spotify-subtext mt-10">Đang tải dữ liệu...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center text-spotify-subtext mt-10 bg-white/5 p-8 rounded-lg">
                    Chưa có thông báo nào. Khi ai đó chia sẻ nhạc, nó sẽ hiện ở đây!
                </div>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((notif) => (
                        <li 
                            key={notif.id} 
                            className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-transparent border border-white/10' : 'bg-white/10'}`}
                        >
                            <div className="mt-1 w-2 h-2 rounded-full bg-[#1ed760] shrink-0 opacity-100"></div>
                            <div className="flex flex-col">
                                <span className="text-base text-white">{notif.message}</span>
                                <span className="text-xs text-spotify-subtext mt-1">
                                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;