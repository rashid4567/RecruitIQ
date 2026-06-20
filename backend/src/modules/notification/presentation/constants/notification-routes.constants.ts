export const NOTIFICATION_ROUTES = {
  ROOT: "/",
  UNREAD_COUNT: "/unread-count",
  MARK_AS_READ: "/:notificationId/read",
  MARK_ALL_AS_READ: "/read-all",
  DELETE: "/:notificationId",
} as const;