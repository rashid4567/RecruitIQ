import { useCallback, useEffect, useState } from "react";
import { Notification } from "../../domain/entity/Notification";
import {
  getNotificationsUC,
  getUnreadNotificationCountUC,
  markNotificationAsReadUC,
  markAllNotificationsAsReadUC,
  deleteNotificationUC,
} from "../di/notification.di";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const data = await getNotificationsUC.execute(page, limit);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    const count = await getUnreadNotificationCountUC.execute();

    console.log("HOOK COUNT:", count);
    
    setUnreadCount(count);
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationAsReadUC.execute(notificationId);

    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.getId() === notificationId && !notification.isRead()) {
          return new Notification({
            ...notification.props,
            isRead: true,
            readAt: new Date().toISOString(),
          });
        }
        return notification;
      }),
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsReadUC.execute();

    setNotifications((prev) =>
      prev.map(
        (notification) =>
          new Notification({
            ...notification.props,
            isRead: true,
            readAt: new Date().toISOString(),
          }),
      ),
    );

    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      const notification = notifications.find(
        (n) => n.getId() === notificationId,
      );

      await deleteNotificationUC.execute(notificationId);

      setNotifications((prev) =>
        prev.filter((n) => n.getId() !== notificationId),
      );

      if (notification && !notification.isRead()) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    },
    [notifications],
  );

  useEffect(() => {
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