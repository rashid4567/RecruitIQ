import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { DomainError } from "../../../../shared/errors/domain.error";
import { NotificationType } from "../constant/notification.constants";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code"; 

export type NotificationRecipientRole = "recruiter" | "candidate";

export interface NotificationProps {
  id?: string;

  recipientId: string;
  recipientRole: NotificationRecipientRole;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt?: Date | null;
  actionUrl?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Notification {
  private constructor(private props: NotificationProps) {}

  public static create(
    recipientId: string,
    recipientRole: NotificationRecipientRole,
    title: string,
    message: string,
    type: NotificationType,
    actionUrl?: string,
    referenceId?: string,
    metadata?: Record<string, unknown>,
  ): Notification {
    if (!recipientId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECIPIENT_ID_REQUIRED);
    }

    if (!title?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.TITLE_REQUIRED);
    }

    if (!message?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.MESSAGE_REQUIRED);
    }

    return new Notification({
      recipientId,
      recipientRole,
      title: title.trim(),
      message: message.trim(),
      type,
      isRead: false,
      readAt: null,
      actionUrl,
      referenceId,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(props: NotificationProps): Notification {
    return new Notification({ ...props });
  }

  public markAsRead(): void {
    if (!this.props.isRead) {
      this.props.isRead = true;
      this.props.readAt = new Date();
      this.props.updatedAt = new Date();
    }
  }

  public markAsUnread(): void {
    this.props.isRead = false;
    this.props.readAt = null;
    this.props.updatedAt = new Date();
  }

  public updateMessage(message: string): void {
    if (!message?.trim()) {
      throw new DomainError(ERROR_CODES.MESSAGE_REQUIRED);
    }

    this.props.message = message.trim();
    this.props.updatedAt = new Date();
  }

  public getId(): string | undefined {
    return this.props.id;
  }

  public getRecipientId(): string {
    return this.props.recipientId;
  }

  public getRecipientRole(): NotificationRecipientRole {
    return this.props.recipientRole;
  }

  public getTitle(): string {
    return this.props.title;
  }

  public getMessage(): string {
    return this.props.message;
  }

  public getType(): NotificationType {
    return this.props.type;
  }

  public isRead(): boolean {
    return this.props.isRead;
  }

  public getReadAt(): Date | null | undefined {
    return this.props.readAt;
  }

  public getActionUrl(): string | undefined {
    return this.props.actionUrl;
  }

  public getReferenceId(): string | undefined {
    return this.props.referenceId;
  }

  public getMetadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  public getProps(): Readonly<NotificationProps> {
    return { ...this.props };
  }
}
