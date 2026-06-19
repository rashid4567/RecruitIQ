import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { MarkAllNotificationsAsReadRequestDTO } from "../dto/markAllAsNeedNotification.dto";

export class MarkAllNotificationsAsReadUseCase implements UseCase<
  MarkAllNotificationsAsReadRequestDTO,
  void
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(request: MarkAllNotificationsAsReadRequestDTO): Promise<void> {
    await this.notificationRepo.markAllAsRead(request.recipientId);
  }
}
