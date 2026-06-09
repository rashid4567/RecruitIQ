import { NotificationRepository } from "../../domain/repositories/notification.repository";

export class MarkAllNotificationsAsReadUseCase{
    constructor(
        private readonly notificationRepo : NotificationRepository
    ){};

    async execute(recipientId : string):Promise<void>{
        await this.notificationRepo.markAllAsRead(recipientId);
    }
}