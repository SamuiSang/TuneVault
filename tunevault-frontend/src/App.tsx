import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout'; // Sửa lại đường dẫn nếu cần
import { PlayerProvider } from './contexts/PlayerContext'; // trước khi có api

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import ShareInbox from './pages/ShareInbox';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

function App() {
  return (
    <PlayerProvider>
    <Router>
        <Routes>
          {/* Route Auth (Đăng nhập/Đăng ký) thường sẽ đứng độc lập, không có Sidebar/PlayerBar */}
          <Route path="/auth" element={<Auth />} />

          {/* Các route con nằm bên trong MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="share-inbox" element={<ShareInbox />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;