import { EmailTemplate } from "../entities/email-template.entity";
import { EmailEvent } from "../constant/templateEvents";
import { BaseRepository } from "../../../../shared/repositories/base.repository";

export interface EmailTemplateRepository extends BaseRepository<EmailTemplate> {
  create(template: EmailTemplate): Promise<EmailTemplate>;
  update(template: EmailTemplate): Promise<EmailTemplate>;
  findByEvent(event: EmailEvent): Promise<EmailTemplate | null>;
  findAll(): Promise<EmailTemplate[]>;
  delete(id: string): Promise<void>;
}
