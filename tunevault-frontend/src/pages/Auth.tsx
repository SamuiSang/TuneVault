// ---> AXIOS VÀ AUTH CONTEXT <---
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const location = useLocation();
  const initialMode = location.state?.isLogin !== false;

  // ---> STATE QUẢN LÝ FORM <---
  const [isLoginView, setIsLoginView] = useState(initialMode);
  const [userName, setUserName] = useState(''); // Tên đăng nhập (dùng cho đăng ký)
  const [emailOrUsername, setEmailOrUsername] = useState(''); // Dùng chung: Login (Email/Username) hoặc Register (Email)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state xác nhận mật khẩu
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && typeof location.state.isLogin === 'boolean') {
      setIsLoginView(location.state.isLogin);
      setError('');
      setSuccessMsg('');
    }
  }, [location.state]);

  // ---> XỬ LÝ SUBMIT (ĐĂNG NHẬP & ĐĂNG KÝ GỘP CHUNG) <---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    try {
      if (isLoginView) {
        // LUỒNG XỬ LÝ ĐĂNG NHẬP
        const res = await axios.post('http://localhost:5277/api/auth/login', { 
          emailOrUsername: emailOrUsername, // Gửi lên thuộc tính emailOrUsername cho backend
          password 
        });
        
        if (res.data) {
          const token = res.data.data || res.data.token || res.data;
          
          if (typeof token !== 'string') {
            throw new Error('Không thể lấy token đăng nhập từ phản hồi server.');
          }

          setSuccessMsg('Đăng nhập thành công! Đang đăng nhập vào hệ thống...');
          
          setTimeout(async () => {
            try {
              await login(token); 
              navigate('/');      
            } catch (loginErr: any) {
              setError(loginErr.message || 'Có lỗi xảy ra khi đồng bộ tài khoản.');
            }
          }, 1500); 
        }
      } else {
        // LUỒNG XỬ LÝ ĐĂNG KÝ
        if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp!');
          return; // Chặn gọi API nếu mật khẩu không khớp
        }

        await axios.post('http://localhost:5277/api/auth/register', { 
          email: emailOrUsername, 
          password: password, 
          username: userName 
        });
        
        setSuccessMsg('Đăng ký thành công! Đang chuyển sang đăng nhập...');
        // Reset form sau khi đăng ký thành công
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsLoginView(true), 2000);
      }
    } catch (err: any) {
      console.error("Lỗi chi tiết từ hệ thống:", err);
      let errorMsg = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra khi kết nối tới máy chủ.';
      if (typeof errorMsg === 'object') {
        errorMsg = err.response?.data?.title || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      }
      setError(errorMsg as string);
    }
  };

  return (
    //BACKGROUND ĐƯỢC PHỐI GRADIENT RADIAL + CHỐNG TRÀN OVERFLOW
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-[#121212] via-[#1c1c1c] to-[#0a110d] text-spotify-text overflow-hidden">
      
      {/*ĐÈN NỀN NEON LẬP LÁNH CHẠY NGẦM (AMBIENT GLOW EFFECTS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-spotify-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1db954]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/*CARD ĐĂNG NHẬP ĐƯỢC ĐỘ THÀNH KÍNH MỜ TRONG SUỐT (GLASSMORPHISM) */}
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
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">Tên đăng nhập (Username)</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên đăng nhập viết liền..."
                className="w-full p-3 bg-[#242424]/70 border border-transparent rounded-lg focus:outline-none focus:border-spotify-primary focus:bg-[#282828] text-sm transition-all"
                required={!isLoginView}
              />
            </div>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">
              {isLoginView ? 'Email hoặc Tên đăng nhập' : 'Email'}
            </label>
            <input 
              type="text" 
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={isLoginView ? "Nhập email hoặc tên đăng nhập..." : "name@domain.com"}
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

          {/* Trường Xác nhận mật khẩu chỉ hiện khi ở chế độ Đăng ký */}
          {!isLoginView && (
            <div>
              <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-spotify-subtext">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#242424]/70 border border-transparent rounded-lg focus:outline-none focus:border-spotify-primary focus:bg-[#282828] text-sm transition-all"
                required={!isLoginView}
              />
            </div>
          )}
          
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