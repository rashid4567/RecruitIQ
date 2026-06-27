import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { MarkAllNotificationsAsReadRequestDTO } from "../dto/markAllAsNeedNotification.dto";

export class MarkAllNotificationsAsReadUseCase implements IUseCase<
  MarkAllNotificationsAsReadRequestDTO,
  void
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(request: MarkAllNotificationsAsReadRequestDTO): Promise<void> {
    await this.notificationRepo.markAllAsRead(request.recipientId);
  }
}
