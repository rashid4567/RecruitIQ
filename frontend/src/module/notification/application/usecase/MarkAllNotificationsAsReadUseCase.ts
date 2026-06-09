import type { NotificationRepository } from "../../domain/repository/notification.repository";

export class MarkAllNotificationsAsReadUseCase{
    private readonly notificationRepo : NotificationRepository;
    constructor(
        notificationRepo : NotificationRepository
    ){
        this.notificationRepo = notificationRepo
    }

    async execute():Promise<void>{
        await this.notificationRepo.markAllAsRead();
    }
}