//gộp PlayerBar + SideBar + TopBar
import { Outlet } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './TopBar';
import PlayerBar from './PlayerBar';

const MainLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-spotify-base overflow-hidden font-sans">
      {/* Vùng phía trên PlayerBar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thanh bên trái */}
        <Sidebar />

        {/* Vùng nội dung trung tâm */}
        <main className="flex-1 flex flex-col bg-spotify-base relative overflow-y-auto">
          <Topbar />
          
          {/* Nội dung các trang (Home, Search, Library...) sẽ được render tại <Outlet /> */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Thanh phát nhạc cố định dưới cùng */}
      <div className="w-full h-24 shrink-0">
        <PlayerBar />
      </div>
    </div>
  );
};

export default MainLayout;