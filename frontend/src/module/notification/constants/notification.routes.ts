export const NOTIFICATION_ROUTES = {
  NOTIFICATIONS: "/notification",
  UNREAD_COUNT: "/notification/unread-count",
  MARK_AS_READ: (notificationId: string) =>
    `/notification/${notificationId}/read`,
  MARK_ALL_AS_READ: "/notification/read-all",
  DELETE_NOTIFICATION: (notificationId: string) =>
    `/notification/${notificationId}`,
} as const;
