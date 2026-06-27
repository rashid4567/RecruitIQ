import { IUseCase } from "../../../../shared/interfaces/usecase.interface";

import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { CreateNotificationRequest } from "../dto/createNotification.dto";

export class CreateNotificationUseCase implements IUseCase<
  CreateNotificationRequest,
  Notification
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async execute(request: CreateNotificationRequest): Promise<Notification> {
    const notification = Notification.create(
      request.recipientId,
      request.recipientRole,
      request.title,
      request.message,
      request.type,
      request.actionUrl,
      request.referenceId,
      request.metadata,
    );
    return await this.notificationRepo.create(notification);
  }
}
