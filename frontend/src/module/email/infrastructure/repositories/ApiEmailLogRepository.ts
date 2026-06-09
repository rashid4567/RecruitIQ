import api from "@/api/axios";
import { EmailLog } from "../../domain/entity/email-log.entity";
import type { EmailLogRepository } from "../../domain/repositories/email-log.repository";

interface EmailLogApiDto {
  id: string;
  to: string;
  subject: string;
  type: "TEST" | "REAL";
  status: "SENT" | "FAILED";
  createdAt?: string;
  error?: string;
}

export class ApiEmailLogRepository implements EmailLogRepository {
  async getAll(): Promise<EmailLog[]> {
    const { data } = await api.get<{
      data: EmailLogApiDto[];
    }>("/admin/email-logs");

    console.log("email log repository :- ", data);

    return data.data.map((log) => this.toDomain(log));
  }

  private toDomain(dto: EmailLogApiDto): EmailLog {
    return new EmailLog({
      id: dto.id,
      to: dto.to,
      subject: dto.subject,
      type: dto.type,
      status: dto.status,
      createdAt: dto.createdAt ?? "",
      error: dto.error,
    });
  }
}