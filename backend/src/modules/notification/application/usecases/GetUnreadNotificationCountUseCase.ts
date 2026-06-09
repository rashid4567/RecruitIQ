import { NotificationRepository } from "../../domain/repositories/notification.repository";

export class GetUnreadNotificationCountUseCase{
    constructor(
        private readonly notificationRepo : NotificationRepository
    ){};

    async execute(recipientId : string):Promise<number>{
        return await this.notificationRepo.getUnreadCount(recipientId)
    }
}