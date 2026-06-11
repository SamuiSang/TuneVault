import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import PlayerBar from './PlayerBar';

// ---> ĐÂY LÀ PHẦN MAIN LAYOUT (KIẾN TRÚC ISLAND CỦA SPOTIFY) <---
const MainLayout = () => {
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

        {/* ---> ĐÂY LÀ PHẦN RIGHT PANEL (CHI TIẾT BÀI HÁT) <--- */}
        {/* Yêu cầu bắt buộc của đề bài: Hiển thị chi tiết nghệ sĩ/bài hát */}
        <aside className="w-[300px] flex-shrink-0 bg-spotify-base rounded-lg p-4 overflow-y-auto hidden xl:block custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Đang phát</h3>
            <button className="text-spotify-subtext hover:text-white">...</button>
          </div>
          
          <div className="text-center text-spotify-subtext text-sm mt-10">
            Chi tiết Bài hát & Nghệ sĩ sẽ hiển thị ở đây khi bạn chọn bài...
          </div>
        </aside>
        {/* ---> END: ĐÂY LÀ PHẦN RIGHT PANEL (CHI TIẾT BÀI HÁT) <--- */}

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