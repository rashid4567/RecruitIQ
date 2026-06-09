import { Notification } from "../../domain/entity/Notification";
import type { NotificationRepository } from "../../domain/repository/notification.repository";

export class GetNotificationsUseCase {
  private readonly notificationRepository: NotificationRepository;

  constructor(
    notificationRepository: NotificationRepository
  ) {
    this.notificationRepository =
      notificationRepository;
  }

  async execute(
    page = 1,
    limit = 20
  ): Promise<Notification[]> {
    return await this.notificationRepository.getNotifications(
      page,
      limit
    );
  }
}