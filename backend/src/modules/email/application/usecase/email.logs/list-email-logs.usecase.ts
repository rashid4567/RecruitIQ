import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailLog } from "../../../domain/entities/email-log.entity";
import { EmailLogRepository } from "../../../domain/repository/email-log.repository";

export class ListEmailLogsUseCase implements UseCase<void, EmailLog[]> {
  constructor(private readonly emailLogRepo: EmailLogRepository) {}

  async execute(): Promise<EmailLog[]> {
    return this.emailLogRepo.list();
  }
}
