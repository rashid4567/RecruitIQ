import { EmailEvent } from "../../../domain/constant/templateEvents";

export interface CreateEmailTemplateInputDto {
  name: string;
  event: EmailEvent;
  subject: string;
  body: string;
}