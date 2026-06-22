import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import PlayerBar from './PlayerBar';
import NowPlayingPanel from './NowPlayingPanel';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSignalR } from '../../hooks/useSignalR';

// ---> ĐÂY LÀ PHẦN MAIN LAYOUT (KIẾN TRÚC ISLAND CỦA SPOTIFY) <---
const MainLayout = () => {

    // ---> BỔ SUNG: Move logic SignalR từ ShareInbox lên cấp cao nhất (MainLayout) <---
    // Tạm lấy token từ localStorage (sau này ráp với AuthContext của Thành)
    const token = localStorage.getItem('token') || '';
    // URL của Hub backend
    const hubUrl = 'http://localhost:5277/hubs/notifications';
    
    // Khởi tạo connection SignalR toàn cục
    const connection = useSignalR(hubUrl, token);

    useEffect(() => {
        if (connection) {
            // Lắng nghe sự kiện từ Backend ở tầng Layout để mọi trang đều bắt được
            connection.on('ReceiveNotification', (message: any) => {
                console.log("Có thông báo mới (Global):", message);
                // Bật Toast nhảy lên màn hình bất kể người dùng đang ở trang nào
                toast.success('🎵 Có người vừa chia sẻ bài hát cho bạn!', {
                    position: "top-right",
                    autoClose: 5000,
                });
            });
        }
        
        // Cleanup function
        return () => {
            if (connection) {
                connection.off('ReceiveNotification');
            }
        };
    }, [connection]);
    // ---> END BỔ SUNG Logic SignalR <---

    return (
        // Nền gốc phải là màu đen tuyệt đối, có khoảng cách gap-2
        <div className="h-screen w-full flex flex-col bg-black overflow-hidden font-sans text-spotify-text p-2 gap-2">
            {/* Vùng Content chính */}
            <div className="flex-1 flex overflow-hidden gap-2">
                {/* Left Sidebar - Chiếm width cố định */}
                <div className="w-[320px] flex-shrink-0 flex flex-col gap-2 overflow-hidden">
                    <Sidebar />
                </div>
                
                {/* Center Main Content - Được bo góc và đổi màu xám */}
                <main className="flex-1 flex flex-col bg-spotify-base rounded-lg relative overflow-y-auto custom-scrollbar">
                    <Topbar />
                    <div className="flex-1 p-6">
                        <Outlet />
                    </div>
                </main>
                
                <aside className="w-[300px] flex-shrink-0 bg-spotify-base rounded-lg p-4 overflow-y-auto hidden xl:block custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold">Đang phát</h3>
                    </div>
                    <NowPlayingPanel />
                </aside>
            </div>
            
            {/* Bottom Player Bar - Nằm sát dưới cùng và được bo góc */}
            <div className="w-full h-[90px] shrink-0 bg-black rounded-lg">
                <PlayerBar />
            </div>
        </div>
    );
};

export default MainLayout;
// ---> END: ĐÂY LÀ PHẦN MAIN LAYOUT (KIẾN TRÚC ISLAND CỦA SPOTIFY) <---