import api from "@/api/axios";
import type { Notification } from "../types/notification.types";

export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<Notification[]> => {
  const res = await api.get(`/notification?page=${page}&limit=${limit}`);

  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get("/notification/unread-count");
  return res.data.data;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.patch(`/notification/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch("/notification/read-all");
};

export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  await api.delete(`/notification/${notificationId}`);
};
