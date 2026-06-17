// ---> AXIOS VÀ AUTH CONTEXT <---
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const location = useLocation();
  // Kiểm tra xem state có được truyền từ TopBar sang không. 
  // Mặc định nếu người dùng gõ trực tiếp URL '/auth' thì vẫn hiển thị Login (true)
  const initialMode = location.state?.isLogin !== false;

  // ---> THÊM STATE ĐĂNG KÝ VÀ TOGGLE <---
  // State để chuyển đổi giữa giao diện Đăng nhập và Đăng ký
  const [isLoginView, setIsLoginView] = useState(initialMode);
  const [userName, setUserName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // ---> END: THÊM STATE ĐĂNG KÝ VÀ TOGGLE <---

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Dùng useEffect để đổi form ngay lập tức nếu người dùng bấm back/forward trình duyệt 
  // hoặc location thay đổi mà component vẫn đang mount.
  useEffect(() => {
    if (location.state && typeof location.state.isLogin === 'boolean') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoginView(location.state.isLogin);
      setError('');
      setSuccessMsg('');
    }
  }, [location.state]);

  // ---> XỬ LÝ SUBMIT (ĐĂNG NHẬP & ĐĂNG KÝ) <---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      if (isLoginView) {
        // 🌟 LUỒNG XỬ LÝ ĐĂNG NHẬP
        const res = await axios.post('http://localhost:5277/api/auth/login', { 
          email, 
          password 
        });
        
        if (res.data) {
          const token = res.data.token || res.data; 
          localStorage.setItem('token', typeof token === 'string' ? token : res.data.token);
          
          // 1. Bật thông báo thành công lên màn hình giống như lúc Đăng ký
          setSuccessMsg('Đăng nhập thành công! Đang đăng nhập vào hệ thống...');
          
          // 2. Trì hoãn chuyển trang 1.5 giây để người dùng kịp nhìn thấy thông báo xanh
          setTimeout(() => {
            login(res.data); // Truyền dữ liệu vào Context
            navigate('/');   // Tiến hành chuyển hướng về trang chủ
          }, 1500); 
        }
      } else {
        // 🌟 LUỒNG XỬ LÝ ĐĂNG KÝ
        await axios.post('http://localhost:5277/api/auth/register', { 
          email, 
          password, 
          username: userName 
        });
        
        setSuccessMsg('Đăng ký thành công! Đang chuyển sang đăng nhập...');
        setTimeout(() => setIsLoginView(true), 2000);
      }
    } catch (err: any) {
      console.error("Lỗi chi tiết từ hệ thống:", err);
      setError(err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra khi kết nối tới máy chủ.');
    }
  };
  // ---> END: XỬ LÝ SUBMIT (ĐĂNG NHẬP & ĐĂNG KÝ) <---

return (
    // 🌟 1. BACKGROUND ĐƯỢC PHỐI GRADIENT RADIAL + CHỐNG TRÀN OVERFLOW
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-[#121212] via-[#1c1c1c] to-[#0a110d] text-spotify-text overflow-hidden">
      
      {/* 🌟 2. CÁC ĐÈN NỀN NEON LẬP LÁNH CHẠY NGẦM (AMBIENT GLOW EFFECTS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-spotify-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1db954]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 🌟 3. CARD ĐĂNG NHẬP ĐƯỢC ĐỘ THÀNH KÍNH MỜ TRONG SUỐT (GLASSMORPHISM) */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-[#181818]/60 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-[0_12px_40px_0_rgba(0,0,0,0.7)]">
        
        <h1 className="text-3xl font-black text-center tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {isLoginView ? 'Đăng nhập TuneVault' : 'Đăng ký Tài khoản'}
        </h1>
        
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg animate-shake">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="p-3 text-sm text-spotify-primary bg-spotify-primary/10 rounded-lg border border-spotify-primary/30 animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginView && (
            <div className="transition-all duration-300">
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">Tên hiển thị</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full p-3 bg-[#242424]/70 border border-transparent rounded-lg focus:outline-none focus:border-spotify-primary focus:bg-[#282828] text-sm transition-all"
                required={!isLoginView}
              />
            </div>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full p-3 bg-[#242424]/70 border border-transparent rounded-lg focus:outline-none focus:border-spotify-primary focus:bg-[#282828] text-sm transition-all"
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-[#242424]/70 border border-transparent rounded-lg focus:outline-none focus:border-spotify-primary focus:bg-[#282828] text-sm transition-all"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 font-bold text-black bg-spotify-primary rounded-full hover:bg-[#1ed760] active:scale-95 shadow-lg shadow-spotify-primary/20 hover:shadow-spotify-primary/30 transition-all duration-200"
          >
            {isLoginView ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="text-center text-sm text-spotify-subtext pt-5 border-t border-white/5">
          {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button 
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
              setSuccessMsg('');
            }} 
            className="text-white hover:text-spotify-primary hover:underline font-bold transition-colors"
          >
            {isLoginView ? 'Đăng ký TuneVault' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Auth;
// ---> END: AXIOS VÀ AUTH CONTEXT <---