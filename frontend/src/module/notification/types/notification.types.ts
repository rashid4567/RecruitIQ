export type NotificationRecipientRole = "candidate" | "recruiter";

export type NotificationType =
  | "JOB_APPLIED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_SELECTED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_STARTED"
  | "INTERVIEW_CANCELLED"
  | "INTERVIEW_RESCHEDULED"
  | "INTERVIEW_ACCEPTED"
  | "INTERVIEW_DECLINED"
  | "INTERVIEW_RESCHEDULE_REQUESTED"
  | "INTERVIEW_RESCHEDULE_REQUEST_APPROVED"
  | "INTERVIEW_RESCHEDULE_REQUEST_REJECTED"
  | "OFFER_SENT"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_RENEWED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_UPGRADED"
  | "SUBSCRIPTION_EXPIRED"
  | "RECRUITER_VERIFIED"
  | "RECRUITER_REJECTED"
  | "JOB_APPROVED"
  | "JOB_REJECTED";

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
