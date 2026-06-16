import React, { useState, useEffect } from 'react';
import { interactionService } from '../../services/interactionService';

interface FollowButtonProps {
    targetId: string; // ID của nghệ sĩ hoặc người dùng cần follow
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetId }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Kiểm tra xem đã follow từ trước chưa khi hiển thị nút
    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const status = await interactionService.checkIsFollowing(targetId);
                setIsFollowing(status);
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái follow:", error);
            }
        };
        if (targetId) {
            fetchFollowStatus();
        }
    }, [targetId]);

    // Xử lý khi bấm nút Toggle Follow/Unfollow
    const handleFollowClick = async () => {
        if (loading) return; // Chống spam click liên tục khi API đang chạy
        setLoading(true);
        try {
            if (isFollowing) {
                await interactionService.unfollowUser(targetId);
                setIsFollowing(false);
            } else {
                await interactionService.followUser(targetId);
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
            className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                isFollowing 
                    ? 'bg-transparent border border-gray-400 text-white hover:border-white' 
                    : 'bg-white text-black hover:scale-105'
            }`}
        >
            {loading ? 'Đang xử lý...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </button>
    );
};

export default FollowButton;