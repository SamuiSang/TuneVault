import api from './api';

// ----> INTERFACES <----
export interface NotificationDto {
  id: string;
  type: string;
  payloadJson: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

/**
 * Lấy danh sách thông báo chưa đọc (để đếm badge)
 */
export const getUnreadNotifications = async (userId: string): Promise<NotificationDto[]> => {
  const response = await api.get(`/notifications/user/${userId}/unread`);
  // Backend trả về BaseResponse<List<NotificationDto>>
  return response.data?.data ?? [];
};

/**
 * Lấy tất cả thông báo của user
 */
export const getUserNotifications = async (userId: string): Promise<NotificationDto[]> => {
  const response = await api.get(`/notifications/user/${userId}`);
  // Backend trả về BaseResponse<GetNotificationsResponseDto> có trường .notifications
  return response.data?.data?.notifications ?? [];
};

/**
 * Đánh dấu 1 thông báo đã đọc
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api.put(`/notifications/${notificationId}/read`);
};

/**
 * Đánh dấu TẤT CẢ thông báo chưa đọc là đã đọc
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const unread = await getUnreadNotifications(userId);
    // Gọi song song để nhanh hơn
    await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
  } catch (error) {
    console.error('Lỗi khi mark all as read:', error);
  }
};
