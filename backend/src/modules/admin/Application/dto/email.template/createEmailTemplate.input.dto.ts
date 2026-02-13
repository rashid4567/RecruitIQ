import { EmailEvent } from "../../../Domain/constatns/email-enum.events";

export interface CreateEmailTemplateInputDto {
  name: string;
  event: EmailEvent;
  subject: string;
  body: string;
}