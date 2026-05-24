import { EmailTemplate } from "../../../email/domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../email/domain/repository/email-template.repository";

import { EmailEvent } from "../../domain/constant/templateEvents";

import { EmailTemplateModel } from "../../../email/infrastructure/mongoose/email-template.model";

export class MongooseEmailTemplateRepository implements EmailTemplateRepository {
  private toEntity(doc: any): EmailTemplate {
    return new EmailTemplate(
      doc._id.toString(),
      doc.name ?? "",
      doc.event,
      doc.subject,
      doc.body,
      doc.isActive,
      doc.createdAt,
    );
  }

  async create(template: EmailTemplate): Promise<EmailTemplate> {
    const doc = await EmailTemplateModel.create({
      name: template.name,
      event: template.event,
      subject: template.subject,
      body: template.body,
      isActive: template.isActive,
    });

    return this.toEntity(doc);
  }

  async update(template: EmailTemplate): Promise<EmailTemplate> {
    const doc = await EmailTemplateModel.findByIdAndUpdate(
      template.id,
      {
        name: template.name,
        event: template.event,
        subject: template.subject,
        body: template.body,
        isActive: template.isActive,
      },
      {
        new: true,
      },
    );

    if (!doc) {
      throw new Error("Email template not found");
    }
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<EmailTemplate | null> {
    const doc = await EmailTemplateModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<EmailTemplate[]> {
    const docs = await EmailTemplateModel.find();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByEvent(event: EmailEvent): Promise<EmailTemplate | null> {
    const doc = await EmailTemplateModel.findOne({
      event,
    });
    return doc ? this.toEntity(doc) : null;
  }
  async delete(id: string): Promise<void> {
    const deleted = await EmailTemplateModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Email template not found");
    }
  }
}
