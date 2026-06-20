import { Router } from "express";

import {
  getNotificationsController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../container/notification.module";
import { authenticate } from "../../../auth/presentation/middlewares/auth.middleware";
import { checkUserActive } from "../../../../shared/middlewares/checkUserActive.middleware";
import { NOTIFICATION_ROUTES } from "../constants/notification-routes.constants";

const router = Router();
router.use(authenticate);
router.use(checkUserActive);
router.get(
  NOTIFICATION_ROUTES.ROOT,
  getNotificationsController.getNotification,
);
router.get(
  NOTIFICATION_ROUTES.UNREAD_COUNT,
  getUnreadNotificationCountController.getUnreadCount,
);
router.patch(
  NOTIFICATION_ROUTES.MARK_AS_READ,
  markNotificationAsReadController.markAsRead,
);
router.patch(
  NOTIFICATION_ROUTES.MARK_ALL_AS_READ,
  markAllNotificationsAsReadController.markAllsRead,
);
router.delete(
  NOTIFICATION_ROUTES.DELETE,
  deleteNotificationController.deleteNotification,
);
export default router;
