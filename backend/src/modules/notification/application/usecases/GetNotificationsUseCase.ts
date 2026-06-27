import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { GetNotificationsRequest } from "../dto/getNotification.dto";

export class GetNotificationsUseCase implements IUseCase<
  GetNotificationsRequest,
  Notification[]
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async execute(request: GetNotificationsRequest): Promise<Notification[]> {
    return await this.notificationRepo.findByRecipientId(
      request.recipientId,
      request.page,
      request.limit,
    );
  }
}
