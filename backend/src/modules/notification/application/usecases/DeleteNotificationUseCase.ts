import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

export class DeleteNotificationUseCase{
    constructor(
        private readonly notificationRepo : NotificationRepository
    ){};

    async execute(notificationId : string):Promise<void>{
        const notification = await this.notificationRepo.findById(notificationId);

        if(!notification){
            throw new ApplicationError(ERROR_CODES.NOTIFICATION_NOT_FOUND);
        }

        await this.notificationRepo.deleteById(notificationId);
    }
}