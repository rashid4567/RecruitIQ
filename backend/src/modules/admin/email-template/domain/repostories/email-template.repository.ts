import { EmailTemplate } from "../entities/email-template.entity";
import { EmailEvent } from "../types/email-enum.events";

export interface EmailTemplateRepository {
    create(template : EmailTemplate):Promise<EmailTemplate>;
    update(template : EmailTemplate):Promise<EmailTemplate>;
    findById(id : string):Promise<EmailTemplate | null>
    findByEvent(event: EmailEvent): Promise<EmailTemplate | null>;
    findAll():Promise<EmailTemplate[]>;
    delete(id : string):Promise<void>;
    toggle(id : string, isActive: boolean):Promise<void>
}