import { useEffect, useState } from 'react';
import axios from 'axios';
// Import các component UI khác của team (giữ nguyên)
import { FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // ---> BỔ SUNG CHO CHIẾN: Lấy userId từ localStorage <---
        const userId = localStorage.getItem('userId');
        
        // Kiểm tra an toàn nếu user chưa đăng nhập
        if (!userId) {
            console.warn("Không tìm thấy userId. Vui lòng đăng nhập.");
            setLoading(false);
            return;
        }

        // ---> BỔ SUNG CHO CHIẾN: Sửa lại URL chuẩn xác <---
        // Code cũ bị lỗi: 
        // const response = await axios.get('https://localhost:7277/api/notifications');
        
        // Code mới: Truyền userId vào đường dẫn endpoint
        const response = await axios.get(`https://localhost:7277/api/notifications/user/${userId}`);
        
        setNotifications(response.data);
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
        toast.error('Không thể tải danh sách thông báo!');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
          {notifications.map((notif, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-center justify-between transition-colors ${notif.isRead ? 'bg-zinc-800' : 'bg-zinc-700 border-l-4 border-[#1ed760]'}`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{notif.message || notif.content}</span>
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(notif.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              {!notif.isRead && (
                <span className="w-3 h-3 bg-[#1ed760] rounded-full shadow-[0_0_8px_#1ed760]"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;