import React, { useEffect, useState } from 'react';
import { interactionService } from '../services/interactionService';
import { useNavigate } from 'react-router-dom';

interface FollowListModalProps {
  userId: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'followers') {
          const res = await interactionService.getFollowers(userId);
          setUsers(res);
        } else {
          // following: gộp cả users và artists
          const [uRes, aRes] = await Promise.all([
            interactionService.getFollowingUsers(userId),
            interactionService.getFollowingArtists(userId)
          ]);
          setUsers([...uRes, ...aRes]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#242424] p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {loading ? (
            <p className="text-gray-400 text-center py-4">Đang tải...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Danh sách trống.</p>
          ) : (
            users.map((u, i) => {
              const name = u.displayName || u.name || u.userName;
              return (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer transition group"
                  onClick={() => {
                    onClose();
                    // u.name có nghĩa là object từ getFollowingArtists (vì backend select ra AS Name)
                    if (u.name) {
                      navigate(`/artist/${u.id}`);
                    } else {
                      navigate(`/profile/${u.id}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg text-white">{name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-spotify-primary transition">{name}</p>
                      {u.userName && <p className="text-xs text-gray-400">@{u.userName}</p>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
