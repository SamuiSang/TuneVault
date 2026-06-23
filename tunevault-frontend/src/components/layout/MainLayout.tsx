import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import PlayerBar from './PlayerBar';
// ---> BỔ SUNG: Import SignalR và Toast để xử lý thông báo toàn cục <---
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSignalR } from '../../hooks/useSignalR';
import { usePlayer } from '../../hooks/usePlayer';

// ---> ĐÂY LÀ PHẦN MAIN LAYOUT (KIẾN TRÚC ISLAND CỦA SPOTIFY) <---
const MainLayout = () => {
    const { currentTrack, queue, currentIndex } = usePlayer();
    const [rightPanelMode, setRightPanelMode] = useState<'nowPlaying' | 'queue'>('nowPlaying');
    const navigate = useNavigate();

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
                
                {/* ---> ĐÂY LÀ PHẦN RIGHT PANEL (CHI TIẾT BÀI HÁT / HÀNG ĐỢI) <--- */}
                <aside className="w-[300px] flex-shrink-0 bg-spotify-base rounded-lg p-4 flex flex-col overflow-hidden hidden xl:flex">
                    {rightPanelMode === 'nowPlaying' ? (
                        <>
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <h3 className="font-bold">Đang phát</h3>
                                <button className="text-spotify-subtext hover:text-white">...</button>
                            </div>
                            {currentTrack ? (
                                <div className="flex flex-col items-center text-center mt-4 group overflow-y-auto custom-scrollbar flex-1">
                                    <img 
                                        src={currentTrack.thumbnailUrl || 'default-cover.png'} 
                                        alt={currentTrack.title}
                                        className="w-full aspect-square object-cover rounded-lg shadow-2xl mb-4 group-hover:scale-105 transition-transform"
                                    />
                                    <h4 className="text-xl font-bold text-white mb-1 px-2">{currentTrack.title}</h4>
                                    <p 
                                      className="text-sm text-spotify-subtext hover:underline cursor-pointer px-2"
                                      onClick={() => navigate(`/artist/${currentTrack.ownerId}`)}
                                    >
                                      {currentTrack.ownerName || currentTrack.ownerId}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-spotify-subtext text-sm mt-10">
                                    Chi tiết Bài hát & Nghệ sĩ sẽ hiển thị ở đây khi bạn chọn bài...
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <h3 className="font-bold text-lg">Hàng đợi</h3>
                                <button onClick={() => setRightPanelMode('nowPlaying')} className="text-spotify-subtext hover:text-white text-2xl font-light">&times;</button>
                            </div>

                            {/* Now Playing section */}
                            {currentTrack && (
                                <div className="mb-6 flex-shrink-0">
                                    <h4 className="font-bold text-white mb-3 text-sm">Đang phát</h4>
                                    <div className="flex items-center gap-3">
                                        <img src={currentTrack.thumbnailUrl || 'default-cover.png'} className="w-12 h-12 rounded object-cover shadow" />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-spotify-primary font-medium text-sm truncate">{currentTrack.title}</span>
                                            <span 
                                              className="text-xs text-spotify-subtext truncate hover:underline cursor-pointer"
                                              onClick={() => navigate(`/artist/${currentTrack.ownerId}`)}
                                            >
                                              {currentTrack.ownerName || currentTrack.ownerId}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Next up section */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                <h4 className="font-bold text-white mb-3 text-sm">Tiếp theo</h4>
                                {queue.length > currentIndex + 1 ? (
                                    <ul className="flex flex-col gap-1">
                                        {queue.slice(currentIndex + 1).map((track, idx) => (
                                            <li key={`${track.id}-${idx}`} className="flex items-center gap-3 p-2 rounded hover:bg-white/10 transition-colors cursor-pointer group">
                                                <img src={track.thumbnailUrl || 'default-cover.png'} alt="cover" className="w-10 h-10 object-cover rounded shadow" />
                                                <div className="flex flex-col overflow-hidden text-left flex-1">
                                                    <span className="text-sm truncate text-white group-hover:text-spotify-primary transition-colors">{track.title}</span>
                                                    <span 
                                                      className="text-xs text-spotify-subtext truncate hover:underline cursor-pointer"
                                                      onClick={(e) => { e.stopPropagation(); navigate(`/artist/${track.ownerId}`); }}
                                                    >
                                                      {track.ownerName || track.ownerId}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-spotify-subtext italic mt-4 text-center">Hàng đợi trống</p>
                                )}
                            </div>
                        </div>
                    )}
                </aside>
                {/* ---> END: ĐÂY LÀ PHẦN RIGHT PANEL (CHI TIẾT BÀI HÁT / HÀNG ĐỢI) <--- */}
            </div>
            
            {/* Bottom Player Bar - Nằm sát dưới cùng và được bo góc */}
            <div className="w-full h-[90px] shrink-0 bg-black rounded-lg">
                <PlayerBar 
                  onToggleQueue={() => setRightPanelMode(prev => prev === 'queue' ? 'nowPlaying' : 'queue')} 
                  isQueueOpen={rightPanelMode === 'queue'} 
                />
            </div>
        </div>
    );
};

export default MainLayout;
// ---> END: ĐÂY LÀ PHẦN MAIN LAYOUT (KIẾN TRÚC ISLAND CỦA SPOTIFY) <---