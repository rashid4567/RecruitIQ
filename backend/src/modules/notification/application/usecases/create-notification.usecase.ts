import { NotificationType } from "../../domain/constant/notification.constants";
import { Notification, NotificationRecipientRole } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

export interface CreateNotificationRequest{

    recipientId : string;
    recipientRole : NotificationRecipientRole;
    title : string;
    message : string;
    type : NotificationType;
    actionUrl ?: string;
    referenceId ?: string;
    metadata ?: Record<string , unknown>;
}


export class CreateNotificationUseCase{
    constructor(
        private readonly notificationRepo : NotificationRepository
    ){};

    async execute(request : CreateNotificationRequest):Promise<Notification>{

        const notification = Notification.create(
       
            request.recipientId,
            request.recipientRole,
            request.title,
            request.message,
            request.type,
            request.actionUrl,
            request.referenceId,
            request.metadata,
        );

        return await this.notificationRepo.create(notification);
    }
}