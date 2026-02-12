import { EmailTemplate } from "../entities/email-template.entity";

export interface EmailTempleteRepository {
  getAll(): Promise<EmailTemplate[]>;
  create(payload: {
    name: string;
    event: string;
    subject: string;
    body: string;
  }): Promise<EmailTemplate>;
  update(
    id: string,
    payload: {
      subject?: string;
      body?: string;
    },
  ): Promise<EmailTemplate>;
  delete(id: string): Promise<void>;
  toggle(id: string, isActive: boolean): Promise<void>;
  sendTestEmail(id: string, email: string): Promise<void>;
}
