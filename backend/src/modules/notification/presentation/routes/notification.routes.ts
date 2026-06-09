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

const router = Router();
router.use(authenticate);
router.use(checkUserActive);
router.get("/", getNotificationsController.getNotification);
router.get(
  "/unread-count",
  getUnreadNotificationCountController.getUnreadCount,
);
router.patch("/:id/read", markNotificationAsReadController.markAsRead);
router.patch("/read-all", markAllNotificationsAsReadController.markAllsRead);
router.delete("/:id", deleteNotificationController.deleteNotification);
export default router;
