import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { UnreadNotificationRequestDTO } from "../dto/unreadNotification.dto";

export class GetUnreadNotificationCountUseCase implements UseCase<UnreadNotificationRequestDTO,number> {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(request : UnreadNotificationRequestDTO): Promise<number> {
    return await this.notificationRepo.getUnreadCount(request.recipientId);
  }
}
