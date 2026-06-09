export type NotificationRecipientRole =
  | "candidate"
  | "recruiter";

export type NotificationType =
  | "JOB_APPLIED"
  | "APPLICATION_SHORTLISTED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_SELECTED"
  | "APPLICATION_WITHDRAWN"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_RESCHEDULED"
  | "INTERVIEW_CANCELLED"
  | "SUBSCRIPTION_PURCHASED"
  | "SUBSCRIPTION_RENEWED"
  | "SUBSCRIPTION_EXPIRING"
  | "SUBSCRIPTION_EXPIRED"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "SYSTEM_NOTIFICATION";

export interface NotificationProps {
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

export class Notification {
  public readonly props: NotificationProps;

  constructor(props: NotificationProps) {
    this.props = props;
  }

  getId(): string {
    return this.props.id;
  }

  getRecipientId(): string {
    return this.props.recipientId;
  }

  getRecipientRole(): NotificationRecipientRole {
    return this.props.recipientRole;
  }

  getTitle(): string {
    return this.props.title;
  }

  getMessage(): string {
    return this.props.message;
  }

  getType(): NotificationType {
    return this.props.type;
  }

  isRead(): boolean {
    return this.props.isRead;
  }

  getReadAt(): string | undefined {
    return this.props.readAt;
  }

  getActionUrl(): string | undefined {
    return this.props.actionUrl;
  }

  getReferenceId(): string | undefined {
    return this.props.referenceId;
  }

  getMetadata():
    | Record<string, unknown>
    | undefined {
    return this.props.metadata;
  }

  getCreatedAt(): string {
    return this.props.createdAt;
  }
}