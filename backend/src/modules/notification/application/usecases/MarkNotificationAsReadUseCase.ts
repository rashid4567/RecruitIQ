import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { MarkNotificationAsReadRequestDTO } from "../dto/markNotificationAs.read";

export class MarkNotificationAsReadUseCase implements UseCase<
  MarkNotificationAsReadRequestDTO,
  void
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async execute(request: MarkNotificationAsReadRequestDTO): Promise<void> {
    const notification = await this.notificationRepo.findById(
      request.notificationId,
    );
    if (!notification) {
      throw new ApplicationError(ERROR_CODES.NOTIFICATION_NOT_FOUND);
    }
    await this.notificationRepo.markAsRead(request.notificationId);
  }
}
