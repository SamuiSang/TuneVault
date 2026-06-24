import { useEffect, useState } from 'react';
import api from '../services/api';
// Import các component UI khác của team (giữ nguyên)
import { FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const userId = user?.id;
        
        // Kiểm tra an toàn nếu user chưa đăng nhập
        if (!userId) {
            console.warn("Không tìm thấy userId. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        const response = await api.get(`/notifications/user/${userId}`);
        
        const responseData = response.data.data || response.data;
        let notificationsArray = [];
        if (Array.isArray(responseData)) {
            notificationsArray = responseData;
        } else if (responseData && Array.isArray(responseData.notifications)) {
            notificationsArray = responseData.notifications;
        }
        
        setNotifications(notificationsArray);
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
        toast.error('Không thể tải danh sách thông báo!');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="p-6 text-white flex justify-center mt-10">
        <p className="animate-pulse">Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white pb-24">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <FiBell className="text-3xl text-[#1ed760]" />
        <h1 className="text-3xl font-bold">Thông báo của bạn</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl p-8 text-center mt-4">
          <p className="text-gray-400">Bạn không có thông báo nào mới.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, index) => {
            let messageText = notif.message || notif.content || notif.Message || notif.Content;
            
            if (!messageText && notif.payloadJson) {
              try {
                const payload = typeof notif.payloadJson === 'string' ? JSON.parse(notif.payloadJson) : notif.payloadJson;
                messageText = payload?.message || payload?.Message || payload?.content || payload?.Content;
              } catch (e) {
                console.error("Lỗi parse JSON:", e);
              }
            } 
            
            if (!messageText) {
                // Thử check nếu notif.payload là object (trường hợp backend trả về thẳng payload)
                if (notif.payload) {
                    messageText = notif.payload?.message || notif.payload?.Message || notif.payload?.content || notif.payload?.Content;
                }
            }

            // Xử lý thông báo cũ (lúc chưa có trường message)
            if (!messageText) {
                const type = notif.type || notif.Type;
                if (type === 'MediaShare') {
                    const payload = typeof notif.payloadJson === 'string' ? JSON.parse(notif.payloadJson) : (notif.payloadJson || notif.payload || {});
                    messageText = payload?.PlaylistId || payload?.playlistId 
                        ? "Bạn có một Playlist mới được chia sẻ!" 
                        : "Bạn có một bài hát mới được chia sẻ!";
                } else if (type === 'Follow') {
                    messageText = "Có người vừa theo dõi bạn!";
                } else {
                    messageText = "Bạn có một thông báo mới!";
                }
            }

            // Fix múi giờ: C# Backend thường trả về UTC ("2026-06-24T04:53:00") nhưng thiếu chữ Z
            // Trình duyệt sẽ hiểu nhầm là giờ Local. Thêm 'Z' để ép nó về UTC và convert sang Local.
            const dateStr = notif.createdAt?.endsWith('Z') ? notif.createdAt : notif.createdAt + 'Z';

            return (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-center justify-between transition-colors ${notif.isRead ? 'bg-zinc-800' : 'bg-zinc-700 border-l-4 border-[#1ed760]'}`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{messageText}</span>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(dateStr).toLocaleString('vi-VN')}
                </span>
              </div>
              {!notif.isRead && (
                <span className="w-3 h-3 bg-[#1ed760] rounded-full shadow-[0_0_8px_#1ed760]"></span>
              )}
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default Notifications;