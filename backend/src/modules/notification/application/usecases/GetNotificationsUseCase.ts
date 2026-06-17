import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

export interface GetNotificationsRequest {
  recipientId: string;
  page?: number;
  limit?: number;
}

export class GetNotificationsUseCase {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async execute(request: GetNotificationsRequest): Promise<Notification[]> {
    return await this.notificationRepo.findByRecipientId(
      request.recipientId,
      request.page,
      request.limit,
    );
  }
}
