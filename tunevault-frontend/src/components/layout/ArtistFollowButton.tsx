import React, { useState, useEffect } from 'react';
import { interactionService } from '../../services/interactionService';
import { useAuth } from '../../contexts/AuthContext';

interface ArtistFollowButtonProps {
  artistId: string;
  compact?: boolean;
}

const ArtistFollowButton: React.FC<ArtistFollowButtonProps> = ({ artistId, compact = false }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user?.id || !artistId) return;
      try {
        const status = await interactionService.checkIsFollowingArtist(user.id, artistId);
        setIsFollowing(status);
      } catch (error) {
        console.error('Lỗi kiểm tra trạng thái follow nghệ sĩ:', error);
      }
    };

    fetchFollowStatus();
  }, [artistId, user?.id]);

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      alert('Vui lòng đăng nhập để theo dõi nghệ sĩ.');
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await interactionService.unfollowArtist(user.id, artistId);
        setIsFollowing(false);
      } else {
        await interactionService.followArtist(user.id, artistId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Lỗi khi follow nghệ sĩ:', error);
      alert('Thao tác thất bại, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowClick}
      disabled={loading}
      className={`rounded-full font-semibold transition-all duration-200 ${
        compact ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
      } ${
        isFollowing
          ? 'bg-transparent border border-gray-400 text-white hover:border-white'
          : 'bg-white text-black hover:scale-105'
      }`}
    >
      {loading ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </button>
  );
};

export default ArtistFollowButton;
