export type NotificationRecipientRole = "candidate" | "recruiter";

export type NotificationType =
  | "JOB_APPLIED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_SELECTED"
  | "APPLICATION_WITHDRAWN"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_RESCHEDULED"
  | "INTERVIEW_CANCELLED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_RENEWED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_UPGRADED"
  | "SUBSCRIPTION_EXPIRED"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "SYSTEM_NOTIFICATION";

  
export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: NotificationRecipientRole;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
