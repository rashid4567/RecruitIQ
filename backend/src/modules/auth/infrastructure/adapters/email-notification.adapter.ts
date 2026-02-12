import { SendEmailByEventUseCase } from "../../../admin/Application/use-Cases/email-template/send-email-by-event.usecase";
import { EmailEvent } from "../../../admin/Domain/constatns/email-enum.events";
import { NotificationPort } from "../../application/ports/notification.port";

export class EmailNotificationAdaptor implements NotificationPort {
  constructor(
    private readonly sendEmailByEventUC: SendEmailByEventUseCase
  ) {}

  async sendEmail(params: {
    event: EmailEvent;
    to: string;
    variables: Record<string, string>;
  }): Promise<void> {
    await this.sendEmailByEventUC.execute(params);
  }
}
