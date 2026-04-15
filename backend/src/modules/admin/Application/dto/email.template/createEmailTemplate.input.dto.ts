import { EmailEvent } from "../../../Domain/constatns/email-enum.events";

export interface sendEmailByInputDto {
  to: string;
  event: EmailEvent;
  variables: Record<string, string>;
}