import api from "@/api/axios";
import type { NotificationRepository } from "../../domain/repository/notification.repository";
import { Notification, type NotificationProps } from "../../domain/entity/Notification";

export class ApiNotificationRepository
  implements NotificationRepository
{
 async getNotifications(
  page = 1,
  limit = 20,
): Promise<Notification[]> {
  const res = await api.get(
    `/notification?page=${page}&limit=${limit}`,
  );



  return res.data.data.map(
    (notification: NotificationProps) =>
      new Notification(notification),
  );
}

  async getUnreadCount(): Promise<number> {
    const res = await api.get(
      "/notification/unread-count",
    );
    return res.data.data;
  }

  async markAsRead(
    notificationId: string,
  ): Promise<void> {
    await api.patch(
      `/notification/${notificationId}/read`,
    );
  }

  async markAllAsRead(): Promise<void> {
    await api.patch(
      "/notification/read-all",
    );
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<void> {
    await api.delete(
      `/notification/${notificationId}`,
    );
  }
}