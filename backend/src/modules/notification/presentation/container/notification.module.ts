import { MongooseNotificationRepository } from "../../infrastructure/repositories/mongoose.notification.repository";
import { CreateNotificationUseCase } from "../../application/usecases/create-notification.usecase";
import { GetNotificationsUseCase } from "../../application/usecases/GetNotificationsUseCase";
import { GetUnreadNotificationCountUseCase } from "../../application/usecases/GetUnreadNotificationCountUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/usecases/MarkNotificationAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../application/usecases/MarkAllNotificationsAsReadUseCase";
import { DeleteNotificationUseCase } from "../../application/usecases/DeleteNotificationUseCase";
import { GetNotificationsController } from "../controllers/GetNotifications.controller";
import { GetUnreadNotificationCountController } from "../controllers/GetUnreadNotificationcount.controller";
import { MarkNotificationAsReadController } from "../controllers/MarkNotificationAsRead.controller";
import { MarkAllNotificationsAsReadController } from "../controllers/MarkAllNotificationsAsRead.controller";
import { DeleteNotificationController } from "../controllers/DeleteNotification.controller";

const notificationRepository = new MongooseNotificationRepository();
export const createNotificationUC = new CreateNotificationUseCase(
  notificationRepository,
);
const getNotificationsUseCase = new GetNotificationsUseCase(
  notificationRepository,
);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(
  notificationRepository,
);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(
  notificationRepository,
);
const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(
  notificationRepository,
);
const deleteNotificationUseCase = new DeleteNotificationUseCase(
  notificationRepository,
);
export const getNotificationsController = new GetNotificationsController(
  getNotificationsUseCase,
);
export const getUnreadNotificationCountController =
  new GetUnreadNotificationCountController(getUnreadNotificationCountUseCase);
export const markNotificationAsReadController =
  new MarkNotificationAsReadController(markNotificationAsReadUseCase);
export const markAllNotificationsAsReadController =
  new MarkAllNotificationsAsReadController(markAllNotificationsAsReadUseCase);
export const deleteNotificationController = new DeleteNotificationController(
  deleteNotificationUseCase,
);
