import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout'; // Sửa lại đường dẫn nếu cần
import { PlayerProvider } from './components/layout/PlayerProvider'; // Sửa lại đường dẫn nếu cần
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
import Favorites from './pages/Favorites'; // ---> THÊM IMPORT TRANG YÊU THÍCH
import ArtistProfile from './pages/ArtistProfile';
import VideoPlayerPage from './pages/VideoPlayerPage'; // ---> BƯỚC 1: THÊM DÒNG IMPORT NÀY
import AllTracks from './pages/AllTracks';
import AlbumDetailView from './pages/AlbumDetail';

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
            <Route path="album/:id" element={<AlbumDetailView />} />
            <Route path="artist/:artistId" element={<ArtistProfile />} />
            <Route path="favorites" element={<Favorites />} /> {/* ---> THÊM ROUTE YÊU THÍCH */}
            <Route path="share-inbox" element={<ShareInbox />} />
            <Route path="/upload" element={<UploadMedia />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="tracks" element={<AllTracks />} />
          </Route>

          {/* ---> BƯỚC 2: THÊM ROUTE RIÊNG CHO VIDEO TẠI ĐÂY
              Tuyến đường này nằm NGOÀI MainLayout nên sẽ có view riêng biệt, hoàn toàn không hiển thị Audio Bar */}
          <Route path="/video/:id" element={<VideoPlayerPage />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </PlayerProvider>
  );
}

export default App;