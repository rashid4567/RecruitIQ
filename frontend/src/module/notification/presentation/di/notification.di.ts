import { ApiNotificationRepository } from "../../infrastructure/repository/ApiNotificationRepository";

import { GetNotificationsUseCase } from "../../application/usecase/getNotification.usecase";
import { GetUnreadNotificationCountUseCase } from "../../application/usecase/GetUnreadNotificationCountUseCase";
import { MarkNotificationsAsReadUseCase } from "../../application/usecase/MarkNotificationAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../application/usecase/MarkAllNotificationsAsReadUseCase";
import { DeleteNotificationUseCase } from "../../application/usecase/DeleteNotificationUseCase";

const notificationRepo = new ApiNotificationRepository();

export const getNotificationsUC = new GetNotificationsUseCase(notificationRepo);

export const getUnreadNotificationCountUC =
  new GetUnreadNotificationCountUseCase(notificationRepo);

export const markNotificationAsReadUC = new MarkNotificationsAsReadUseCase(
  notificationRepo,
);

export const markAllNotificationsAsReadUC =
  new MarkAllNotificationsAsReadUseCase(notificationRepo);

export const deleteNotificationUC = new DeleteNotificationUseCase(
  notificationRepo,
);


