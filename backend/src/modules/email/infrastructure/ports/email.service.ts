import { SendEmailDto } from "../../application/dto/email.template/send-email.dto";

export interface EmailService {
  send(
    data: SendEmailDto
  ): Promise<void>;
}