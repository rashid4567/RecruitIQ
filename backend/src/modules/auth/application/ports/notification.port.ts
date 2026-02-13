import { EmailEvent } from "../../../admin/Domain/constatns/email-enum.events";

export interface NotificationPort {
  sendEmail(params: {
    event: EmailEvent;
    to: string;
    variables: Record<string, string>;
  }): Promise<void>;
}
