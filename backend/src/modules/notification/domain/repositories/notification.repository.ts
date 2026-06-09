import { Notification } from "../entities/Notification";

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findById(notificationId: string): Promise<Notification | null>;
  findByRecipientId(
    recipientId: string,
    page?: number,
    limit?: number,
  ): Promise<Notification[]>;
  findUnreadByRecipientId(recipientId: string): Promise<Notification[]>;
  getUnreadCount(recipientId: string): Promise<number>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(recipientId: string): Promise<void>;
  deleteById(notificationId: string): Promise<void>;
  //deleteAllForRecipient(recipientId: string): Promise<void>;
}
