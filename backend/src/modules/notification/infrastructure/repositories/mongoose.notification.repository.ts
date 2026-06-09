import { NotificationModel } from "../mongoose/notification.model";

import {
  Notification,
  NotificationProps,
} from "../../domain/entities/Notification";

import { NotificationRepository } from "../../domain/repositories/notification.repository";

export class MongooseNotificationRepository implements NotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    const created = await NotificationModel.create(notification.getProps());

    return Notification.reconstitute(this.toDomain(created));
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification =
      await NotificationModel.findById(notificationId).lean();

    if (!notification) {
      return null;
    }

    return Notification.reconstitute(this.toDomain(notification));
  }

  async findByRecipientId(
    recipientId: string,
    page = 1,
    limit = 20,
  ): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      recipientId,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return notifications.map((notification) =>
      Notification.reconstitute(this.toDomain(notification)),
    );
  }

  async findUnreadByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      recipientId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return notifications.map((notification) =>
      Notification.reconstitute(this.toDomain(notification)),
    );
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      recipientId,
      isRead: false,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(notificationId, {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await NotificationModel.updateMany(
      {
        recipientId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );
  }

  async deleteById(notificationId: string): Promise<void> {
    await NotificationModel.findByIdAndDelete(notificationId);
  }

  private toDomain(doc: any): NotificationProps {
    return {
      id: doc._id.toString(),
      recipientId: doc.recipientId.toString(),
      recipientRole: doc.recipientRole,
      title: doc.title,
      message: doc.message,
      type: doc.type,
      isRead: doc.isRead,
      readAt: doc.readAt,
      actionUrl: doc.actionUrl,
      referenceId: doc.referenceId,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
