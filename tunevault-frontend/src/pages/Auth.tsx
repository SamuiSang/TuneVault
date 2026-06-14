// ---> AXIOS VÀ AUTH CONTEXT <---
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

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
        // Luồng xử lý Đăng nhập
        const response = await authService.login({ email, password });
        
        if (response.success && response.data) {
          login(response.data); // Truyền token vào context
          navigate('/'); // Chuyển hướng về trang Home
        } else {
          setError(response.message || 'Đăng nhập thất bại!');
        }
      } else {
        // Luồng xử lý Đăng ký
        const response = await authService.register({ email, password, userName });
        
        if (response.success) {
          setSuccessMsg('Đăng ký thành công! Đang chuyển sang đăng nhập...');
          // Tự động chuyển về form login sau 2 giây
          setTimeout(() => setIsLoginView(true), 2000);
        } else {
          setError(response.message || 'Đăng ký thất bại!');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới máy chủ.');
    }
  };
  // ---> END: XỬ LÝ SUBMIT (ĐĂNG NHẬP & ĐĂNG KÝ) <---

  return (
    <div className="flex h-screen items-center justify-center bg-spotify-base text-spotify-text">
      <div className="w-full max-w-md p-8 space-y-6 bg-spotify-elevated rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          {isLoginView ? 'Đăng nhập TuneVault' : 'Đăng ký Tài khoản'}
        </h1>
        
        {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
        
        {/* ---> THÊM HIỂN THỊ THÔNG BÁO THÀNH CÔNG <--- */}
        {successMsg && <div className="p-3 text-sm text-spotify-primary bg-spotify-primary/10 rounded border border-spotify-primary">{successMsg}</div>}
        {/* ---> END: THÊM HIỂN THỊ THÔNG BÁO THÀNH CÔNG <--- */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---> THÊM TRƯỜNG USERNAME CHO FORM ĐĂNG KÝ <--- */}
          {!isLoginView && (
            <div>
              <label className="block mb-2 text-sm text-spotify-subtext">Tên hiển thị</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 bg-spotify-highlight rounded focus:outline-none focus:ring-2 focus:ring-spotify-primary"
                required={!isLoginView}
              />
            </div>
          )}
          {/*  ---> END: THÊM TRƯỜNG USERNAME CHO FORM ĐĂNG KÝ <--- */}

          <div>
            <label className="block mb-2 text-sm text-spotify-subtext">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-spotify-highlight rounded focus:outline-none focus:ring-2 focus:ring-spotify-primary"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-spotify-subtext">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-spotify-highlight rounded focus:outline-none focus:ring-2 focus:ring-spotify-primary"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 font-bold text-black bg-spotify-primary rounded-full hover:scale-105 transition-transform"
          >
            {isLoginView ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </form>

        {/*  ---> NÚT TOGGLE CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ <--- */}
        <div className="text-center text-sm text-spotify-subtext pt-4 border-t border-spotify-highlight">
          {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button 
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
              setSuccessMsg('');
            }} 
            className="text-white hover:text-spotify-primary hover:underline font-semibold transition-colors"
          >
            {isLoginView ? 'Đăng ký TuneVault' : 'Đăng nhập'}
          </button>
        </div>
        {/*  ---> END: NÚT TOGGLE CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ <--- */}
      </div>
    </div>
  );
};

export default Auth;
// ---> END: AXIOS VÀ AUTH CONTEXT <---