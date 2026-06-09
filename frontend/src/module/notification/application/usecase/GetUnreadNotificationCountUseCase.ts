import type { NotificationRepository } from "../../domain/repository/notification.repository";

export class GetUnreadNotificationCountUseCase{
    private readonly notificationRepo : NotificationRepository;
    constructor(
        notificationRepo : NotificationRepository
    ){
        this.notificationRepo = notificationRepo
    }

    async execute():Promise<number>{
        return await this.notificationRepo.getUnreadCount();
    }
}