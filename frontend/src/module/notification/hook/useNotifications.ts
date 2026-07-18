import { useCallback, useEffect, useState } from "react";
import type { Notification } from "../types/notification.types";
import {
  getNotifications,
  getUnreadCount,
  markAsRead as markNotificationAsRead,
  markAllAsRead as markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi,
} from "../api/notification.api";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);

      const data = await getNotifications(page, limit);

      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationAsRead(notificationId);

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString(),
            }
          : notification,
      ),
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: new Date().toISOString(),
      })),
    );

    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      const notification = notifications.find((n) => n.id === notificationId);
      await deleteNotificationApi(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications],
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refresh();
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,

    fetchNotifications,
    fetchUnreadCount,
    refresh,

    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
