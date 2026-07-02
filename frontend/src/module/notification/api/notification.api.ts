import api from "@/api/axios";
import { NOTIFICATION_ROUTES } from "../constants/notification.routes";
import type { Notification } from "../types/notification.types";

export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<Notification[]> => {
  const res = await api.get(NOTIFICATION_ROUTES.NOTIFICATIONS, {
    params: {
      page,
      limit,
    },
  });
  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get(NOTIFICATION_ROUTES.UNREAD_COUNT);
  return res.data.data;
};
export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.patch(NOTIFICATION_ROUTES.MARK_AS_READ(notificationId));
};
export const markAllAsRead = async (): Promise<void> => {
  await api.patch(NOTIFICATION_ROUTES.MARK_ALL_AS_READ);
};
export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  await api.delete(NOTIFICATION_ROUTES.DELETE_NOTIFICATION(notificationId));
};
