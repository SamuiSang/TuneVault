const Topbar = () => {
  return (
    <header className="h-16 bg-spotify-base flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {/* Nút điều hướng (Mock) */}
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-spotify-subtext cursor-not-allowed">
          &lt;
        </button>
        <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-spotify-subtext cursor-not-allowed">
          &gt;
        </button>
      </div>

      <div className="flex items-center gap-4 text-spotify-text text-sm font-bold">
        <button className="hover:scale-105 transition-transform">Đăng ký</button>
        <button className="bg-spotify-text text-black px-6 py-2 rounded-full hover:scale-105 transition-transform">
          Đăng nhập
        </button>
      </div>
    </header>
  );
};

export default Topbar;