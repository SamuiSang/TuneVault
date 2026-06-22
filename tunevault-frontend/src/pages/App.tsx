import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout'; 
import { PlayerProvider } from './components/layout/PlayerProvider'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import ShareInbox from './pages/ShareInbox';
import UploadMedia from './pages/UploadMedia';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import VideoPlayerPage from './pages/VideoPlayerPage'; 
import ArtistProfile from './pages/ArtistProfile'; // ---> THÊM IMPORT TRANG NGHỆ SĨ Ở ĐÂY

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          {/* Route Auth (Đăng nhập/Đăng ký) thường sẽ đứng độc lập, không có Sidebar/PlayerBar */}
          <Route path="/auth" element={<Auth />} />

          {/* Các route con nằm bên trong MainLayout (Có chứa Sidebar, PlayerBar/AudioBar chung) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="share-inbox" element={<ShareInbox />} />
            <Route path="/upload" element={<UploadMedia />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="artist/:artistId" element={<ArtistProfile />} /> {/* ---> THÊM ROUTE NGHỆ SĨ VÀO ĐÂY */}
          </Route>

          {/* Tuyến đường này nằm NGOÀI MainLayout nên sẽ có view riêng biệt, hoàn toàn không hiển thị Audio Bar */}
          <Route path="/video/:id" element={<VideoPlayerPage />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </PlayerProvider>
  );
}

export default App;