import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { DeleteNotificationRequestDTO } from "../dto/deleteNotification.dto";

export class DeleteNotificationUseCase implements UseCase<
  DeleteNotificationRequestDTO,
  void
> {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  async execute(request: DeleteNotificationRequestDTO): Promise<void> {
    const notification = await this.notificationRepo.findById(
      request.notificationId,
    );
    if (!notification) {
      throw new ApplicationError(ERROR_CODES.NOTIFICATION_NOT_FOUND);
    }

    await this.notificationRepo.deleteById(request.notificationId);
  }
}
