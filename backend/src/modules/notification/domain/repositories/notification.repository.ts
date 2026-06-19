import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { Notification } from "../entities/Notification";

export interface NotificationRepository extends BaseRepository<Notification> {
  create(notification: Notification): Promise<Notification>;
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
}
