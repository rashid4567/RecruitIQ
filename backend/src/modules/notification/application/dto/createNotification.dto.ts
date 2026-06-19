import { NotificationRecipientRole } from "../../domain/entities/Notification";
import { NotificationType } from "../../infrastructure/mongoose/notification.model";

export interface CreateNotificationRequest {
  recipientId: string;
  recipientRole: NotificationRecipientRole;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
}
