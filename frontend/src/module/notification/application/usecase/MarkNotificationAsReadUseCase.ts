import type { NotificationRepository } from "../../domain/repository/notification.repository";

export class MarkNotificationsAsReadUseCase {
  private readonly notificationRepo: NotificationRepository;
  constructor(notificationRepo: NotificationRepository) {
    this.notificationRepo = notificationRepo;
  }

  async execute(notificationId: string): Promise<void> {
    await this.notificationRepo.markAsRead(notificationId);
  }
}
