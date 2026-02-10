import { EmailTemplate } from "../../Domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../Domain/repositories/email-template.repository";
import { EmailEvent } from "../../Domain/constatns/email-enum.events";
import { EmailTemplateModel } from "../mongoose/email-template.model";

export class MongooseEmailTemplateRepository
  implements EmailTemplateRepository
{
  async create(template: EmailTemplate) {
    const doc = await EmailTemplateModel.create(template);
    return new EmailTemplate(
      doc._id.toString(),
      doc.name ?? "",
      doc.event,
      doc.subject,
      doc.body,
      doc.isActive,
      doc.createdAt
    );
  }

  async update(template: EmailTemplate) {
    const doc = await EmailTemplateModel.findByIdAndUpdate(
      template.id,
      { subject: template.subject, body: template.body },
      { new: true }
    );
    if (!doc) throw new Error("Template not found");
    return new EmailTemplate(
      doc._id.toString(),
      doc.name ?? "",
      doc.event,
      doc.subject,
      doc.body,
      doc.isActive,
      doc.createdAt
    );
  }
  async findById(id: string) {
    const doc = await EmailTemplateModel.findById(id);
    return doc
      ? new EmailTemplate(
          doc._id.toString(),
          doc.name ?? "",
          doc.event,
          doc.subject,
          doc.body,
          doc.isActive,
          doc.createdAt
        )
      : null;
  }

  async findAll(): Promise<EmailTemplate[]> {
    const docs = await EmailTemplateModel.find();

    return docs.map(
      (d) =>
        new EmailTemplate(
          d._id.toString(),
          d.name ?? "",
          d.event,
          d.subject,
          d.body,
          d.isActive,
          d.createdAt
        )
    );
  }

  async findByEvent(event: EmailEvent) {
    const doc = await EmailTemplateModel.findOne({
      event,
      isActive: true,
    });

    return doc
      ? new EmailTemplate(
          doc._id.toString(),
          doc.name ?? "",
          doc.event,
          doc.subject,
          doc.body,
          doc.isActive,
          doc.createdAt
        )
      : null;
  }

  async toggle(id: string, isActive: boolean) {
    await EmailTemplateModel.findByIdAndUpdate(id, { isActive });
  }

  async delete(id: string): Promise<void> {
    const result = await EmailTemplateModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Email template not found");
    }
  }
}
