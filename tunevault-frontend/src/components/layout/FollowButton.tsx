import React, { useState, useEffect } from 'react';
import { interactionService } from '../../services/interactionService';
import { useAuth } from '../../contexts/AuthContext';

interface FollowButtonProps {
    targetId: string; // ID của nghệ sĩ hoặc người dùng cần follow
    className?: string; // Optional custom classes
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetId, className }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();

    // Lấy ID của người dùng đang đăng nhập (Người đi follow)
    const currentUserId = user?.id || localStorage.getItem("userId");

    // Kiểm tra xem đã follow từ trước chưa khi hiển thị nút
    useEffect(() => {
        const fetchFollowStatus = async () => {
            if (!currentUserId || !targetId) return;
            try {
                const status = await interactionService.checkIsFollowing(currentUserId, targetId);
                setIsFollowing(status);
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái follow:", error);
            }
        };
        fetchFollowStatus();
    }, [currentUserId, targetId]);

    // Xử lý khi bấm nút Toggle Follow/Unfollow
    const handleFollowClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Tránh sự kiện click nhảy ra ngoài thẻ cha
        
        if (!currentUserId) {
            alert("Vui lòng đăng nhập để sử dụng tính năng theo dõi!");
            return;
        }

        if (loading) return;
        setLoading(true);
        
        try {
            if (isFollowing) {
                await interactionService.unfollowUser(currentUserId, targetId);
                setIsFollowing(false);
            } else {
                await interactionService.followUser(currentUserId, targetId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Lỗi khi thực hiện tương tác follow:", error);
            alert("Thao tác thất bại, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollowClick}
            disabled={loading}
            className={className || `px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                isFollowing 
                    ? 'bg-transparent border border-gray-400 text-white hover:border-white' 
                    : 'bg-white text-black hover:scale-105'
            }`}
        >
            {loading ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </button>
    );
};

export default FollowButton;