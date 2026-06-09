import { Notification } from "../entity/Notification";

export interface NotificationRepository {
  getNotifications(page?: number, limit?: number): Promise<Notification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
}
