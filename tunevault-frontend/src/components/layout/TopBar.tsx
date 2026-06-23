import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PlayerContext } from '../../contexts/PlayerContext';
import { FiHome, FiSearch, FiInbox, FiBell, FiX } from 'react-icons/fi';
import {
  getUnreadNotifications,
  markAllNotificationsAsRead,
} from '../../services/notificationService';
import { searchMedia, searchArtists, searchPlaylists } from '../../services/searchService';

type SuggestionType = 'media' | 'artist' | 'playlist';

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  type: SuggestionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  originalData: any;
}

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const player = useContext(PlayerContext);

  // State quản lý việc đóng/mở Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ---> THÊM: Quản lý popup tìm kiếm gần đây <---
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span className="text-white font-medium truncate">{text}</span>;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className="text-spotify-subtext font-medium truncate">
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-white font-bold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Lấy gợi ý tổng hợp khi gõ
  useEffect(() => {
    const keyword = searchParams.get('q');
    if (!keyword || !keyword.trim()) {
      Promise.resolve().then(() => setSuggestions([]));
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [mediaRes, artistRes, playlistRes] = await Promise.all([
          searchMedia(keyword.trim()),
          searchArtists(keyword.trim()),
          searchPlaylists(keyword.trim())
        ]);

        const mediaArray = Array.isArray(mediaRes) ? mediaRes : (mediaRes?.data || []);
        const artistArray = Array.isArray(artistRes) ? artistRes : (artistRes?.data || []);
        const playlistArray = Array.isArray(playlistRes) ? playlistRes : (playlistRes?.data || []);

        const formattedSuggestions: SearchSuggestion[] = [];

        // Lấy tối đa 3 bài hát
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mediaArray.slice(0, 3).forEach((item: any) => {
          formattedSuggestions.push({
            id: item.id,
            title: item.title,
            subtitle: item.artistName || 'Unknown Artist',
            imageUrl: item.thumbnailUrl,
            type: 'media',
            originalData: item
          });
        });

        // Lấy tối đa 2 nghệ sĩ
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        artistArray.slice(0, 2).forEach((item: any) => {
          formattedSuggestions.push({
            id: item.id,
            title: item.name,
            subtitle: 'Nghệ sĩ',
            imageUrl: item.imageUrl,
            type: 'artist',
            originalData: item
          });
        });

        // Lấy tối đa 2 playlist
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        playlistArray.slice(0, 2).forEach((item: any) => {
          formattedSuggestions.push({
            id: item.id,
            title: item.name,
            subtitle: 'Danh sách phát',
            imageUrl: null, // Playlist DTO hiện tại chưa có CoverImageUrl
            type: 'playlist',
            originalData: item
          });
        });

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Lỗi khi tải gợi ý tổng hợp:", error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchParams]);

  const addRecentSearch = (term: string) => {
    let updated = [term, ...recentSearches.filter(t => t !== term)];
    if (updated.length > 5) updated = updated.slice(0, 5); // Keep last 5
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // -----> BADGE SỐ LƯỢNG THÔNG BÁO CHƯA ĐỌC <-----
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Lắng nghe sự kiện click chuột để tự động đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Gọi API lấy số lượng thông báo chưa đọc mỗi khi user thay đổi (login/logout)
  useEffect(() => {
    if (!user?.id) {
      Promise.resolve().then(() => setUnreadCount(0));
      return;
    }
    const fetchUnreadCount = async () => {
      try {
        const unread = await getUnreadNotifications(user.id);
        setUnreadCount(unread.length);
      } catch {
        // Không làm gì nếu lỗi (user chưa có thông báo)
      }
    };
    void fetchUnreadCount();
  }, [user?.id]);

  // Khi user click chuông: đánh dấu tất cả đã đọc và reset badge về 0
  const handleBellClick = async () => {
    if (!user?.id || unreadCount === 0) return;
    setUnreadCount(0); // Cập nhật UI ngay lập tức (optimistic update)
    try {
      await markAllNotificationsAsRead(user.id);
    } catch {
      // Nếu lỗi, có thể fetch lại để đồng bộ
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="h-16 bg-spotify-base flex items-center justify-between px-6 sticky top-0 z-10 gap-4">
      {/* ---> LEFT PORTION: HOME & SEARCH <--- */}
      <div className="flex items-center gap-2 flex-1 max-w-2xl">
        {/* Nút Home */}
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-[#1F1F1F] hover:bg-[#2A2A2A] flex items-center justify-center text-spotify-subtext hover:text-white transition-colors flex-shrink-0"
          title="Home"
        >
          <FiHome className="text-[24px]" />
        </button>

        {/* Thanh Search Container */}
        <div className="relative flex-1" ref={searchContainerRef}>
          <div
            onClick={() => {
              if (location.pathname !== '/search') {
                navigate('/search');
              }
              setIsSearchFocused(true);
            }}
            className="flex items-center bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:ring-1 hover:ring-white/20 focus-within:ring-2 focus-within:ring-white focus-within:bg-[#2A2A2A] rounded-full h-12 px-3 transition-all cursor-text w-full"
          >
            <FiSearch className="text-spotify-subtext hover:text-white text-[24px] ml-1 mr-3 flex-shrink-0 cursor-pointer" />
            <input
              type="text"
              value={searchParams.get('q') || ''}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = searchParams.get('q');
                  if (q && q.trim()) {
                    addRecentSearch(q.trim());
                  }
                }
              }}
              placeholder="What do you want to play?"
              className="bg-transparent border-none outline-none text-white w-full placeholder-spotify-subtext font-medium text-base h-full"
            />

            {/* Nút Xóa Search */}
            {searchParams.get('q') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/search');
                  setIsSearchFocused(true);
                }}
                className="text-spotify-subtext hover:text-white p-1 mr-2 rounded-full flex-shrink-0"
              >
                <FiX className="text-xl" />
              </button>
            )}

            <div className="border-l border-white/20 pl-3 ml-2 flex items-center h-6 flex-shrink-0">
              <FiInbox className="text-spotify-subtext hover:text-white text-xl cursor-pointer" title="Browse" />
            </div>
          </div>

          {/* Popup tìm kiếm (Lịch sử & Gợi ý) */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#282828] rounded-lg shadow-2xl p-4 z-50">
              {!searchParams.get('q') ? (
                <>
                  <h3 className="text-white font-bold text-lg mb-4">Lịch sử tìm kiếm</h3>
                  {recentSearches.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {recentSearches.map((term, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <FiSearch className="text-spotify-subtext text-xl" />
                            <span className="text-white font-medium">{term}</span>
                          </div>
                          <button
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-spotify-subtext hover:text-white opacity-0 group-hover:opacity-100 p-1"
                            title="Xóa"
                          >
                            <FiX />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-spotify-subtext text-center py-4">Hãy tìm kiếm bài hát</p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-white font-bold text-lg mb-4">Kết quả gợi ý</h3>
                  {suggestions.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {/* TEXT SUGGESTIONS */}
                      {Array.from(new Set(suggestions.map(s => s.title)))
                        .filter(t => t.toLowerCase().includes((searchParams.get('q') || '').toLowerCase()) && t.toLowerCase() !== (searchParams.get('q') || '').toLowerCase())
                        .slice(0, 3)
                        .map((term, idx) => (
                        <li
                          key={`text-${idx}`}
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-white/10 rounded cursor-pointer group"
                        >
                          <FiSearch className="text-spotify-subtext text-xl flex-shrink-0" />
                          <div className="flex flex-col overflow-hidden w-full">
                            {highlightMatch(term, searchParams.get('q') || '')}
                          </div>
                        </li>
                      ))}

                      {suggestions.map((item) => (
                        <li
                          key={`${item.type}-${item.id}`}
                          onClick={() => {
                            setIsSearchFocused(false);
                            addRecentSearch(item.title);
                            if (item.type === 'media') {
                              const mappedItem = {
                                id: item.originalData.id || item.originalData.Id,
                                title: item.originalData.title || item.originalData.Title,
                                thumbnailUrl: item.originalData.thumbnailUrl || item.originalData.ThumbnailUrl,
                                ownerId: item.originalData.artistName || item.originalData.ArtistName || 'Unknown',
                                type: 'Audio',
                                duration: item.originalData.duration || item.originalData.Duration || 0,
                                filePath: ''
                              };
                              void player?.playTrack(mappedItem as any);
                            } else if (item.type === 'artist') {
                              navigate(`/artist/${item.id}`);
                            } else if (item.type === 'playlist') {
                              navigate(`/playlist/${item.id}`);
                            }
                          }}
                          className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-spotify-elevated rounded flex-shrink-0 flex items-center justify-center text-spotify-subtext overflow-hidden">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                "♪"
                              )}
                            </div>
                            <div className="flex flex-col overflow-hidden max-w-[200px] sm:max-w-[300px]">
                              {highlightMatch(item.title, searchParams.get('q') || '')}
                              <span className="text-spotify-subtext text-xs truncate">{item.subtitle}</span>
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-spotify-subtext font-bold bg-white/5 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.type === 'media' ? 'BÀI HÁT' : item.type === 'artist' ? 'NGHỆ SĨ' : 'PLAYLIST'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-spotify-subtext text-center py-4">Không tìm thấy gợi ý nào</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --->  NÚT ĐĂNG NHẬP ĐĂNG KÝ HOẶC THÔNG TIN USER <--- */}
      <div className="flex items-center gap-4 text-spotify-text text-sm font-bold">
        {isAuthenticated ? (
          // HIỆN THỊ KHI ĐÃ ĐĂNG NHẬP (ICON CHUÔNG + AVATAR + DROPDOWN)
          <>
            {/* -----> ICON CHUÔNG VỚI BADGE <----- */}
            <button
              onClick={handleBellClick}
              title="Thông báo"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-all"
            >
              <FiBell className="text-[20px]" />
              {/* Badge chỉ hiện khi có thông báo chưa đọc */}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-[3px] leading-none animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button //AVATAR NGƯỜI DÙNG
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold hover:scale-105 transition-transform ${user?.avatarUrl ? 'bg-transparent' : 'bg-pink-500 text-black'}`}
                title={user?.userName}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.userName?.charAt(0).toUpperCase() || 'U'
                )}
              </button>

              {isDropdownOpen && ( //DROP DOWN KIỂU SPOTIFY
                <div className="absolute right-0 mt-2 w-48 bg-spotify-elevated rounded shadow-2xl py-1 z-50 text-spotify-text text-sm font-medium">
                  <button  //HỒ SƠ
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                  >
                    Hồ sơ
                  </button>
                  <button // SETTING
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // navigate('/settings'); (Nếu sau này bạn có làm trang cài đặt)
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                  >
                    Cài đặt
                  </button>

                  <div className="border-t border-spotify-highlight my-1"></div> {/*A LINES */}

                  <button //LOGOUT 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-spotify-highlight transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </> // đóng fragment của phần đã đăng nhập
        ) : (
          // Hiển thị (đăng ký / đăng nhập) khi CHƯA ĐĂNG NHẬP
          <>
            <button
              onClick={() => navigate('/auth', { state: { isLogin: false } })}
              className="hover:scale-105 transition-transform text-spotify-subtext hover:text-white"
            >
              Đăng ký
            </button>
            <button
              onClick={() => navigate('/auth', { state: { isLogin: true } })}
              className="bg-white text-black px-6 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Đăng nhập
            </button>
          </>
        )}
      </div>
      {/* ---> NÚT ĐĂNG NHẬP ĐĂNG KÝ HOẶC THÔNG TIN USER <--- */}
    </header>
  );
};

export default Topbar;