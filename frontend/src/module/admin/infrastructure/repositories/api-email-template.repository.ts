import api from "@/api/axios";

import { EmailTemplate } from "../../domain/entities/email-template.entity";
import type { EmailTempleteRepository } from "../../domain/repositories/email-template.repository";
import type { EmailTemplateEvent } from "@/types/admin/email-template.types";

interface EmailTemplateApiDto {
  id: string;
  name: string;
  event: EmailTemplateEvent;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export class ApiEmailTemplateRepository implements EmailTempleteRepository {
  async create(payload: {
    name: string;
    event: string;
    subject: string;
    body: string;
  }): Promise<EmailTemplate> {
    const { data } = await api.post<{ data: EmailTemplateApiDto }>(
      "/admin/email-templates",
      payload,
    );

    return this.toDomain(data.data);
  }

  async update(
    id: string,
    payload: {
      subject?: string;
      body?: string;
    },
  ): Promise<EmailTemplate> {
    const { data } = await api.put<{ data: EmailTemplateApiDto }>(
      `/admin/email-templates/${id}`,
      payload,
    );

    return this.toDomain(data.data);
  }

  async getAll(): Promise<EmailTemplate[]> {
    const { data } = await api.get<{ data: EmailTemplateApiDto[] }>(
      "/admin/email-templates",
    );

    return data.data.map((dto) => this.toDomain(dto));
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/email-templates/${id}`);
  }

  async toggle(id: string, isActive: boolean): Promise<void> {
    await api.patch(`/admin/email-templates/${id}/toggle`, { isActive });
  }

  async sendTestEmail(id: string, email: string): Promise<void> {
    await api.post(`/admin/email-templates/${id}/test`, { email });
  }

  private toDomain(dto: EmailTemplateApiDto): EmailTemplate {
    return new EmailTemplate({
      id: dto.id,
      name: dto.name,
      event: dto.event,
      subject: dto.subject,
      body: dto.body,
      isActive: dto.isActive,
      createdAt: dto.createdAt,
    });
  }
}
