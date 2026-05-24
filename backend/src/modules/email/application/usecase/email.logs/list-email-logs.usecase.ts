import { EmailLogRepository } from "../../../domain/repository/email-log.repository";

export class ListEmailLogsUseCase {

  constructor(
    private readonly emailLogRepo:
    EmailLogRepository
  ) {}

  async execute() {
    return await this.emailLogRepo.list();
  }
}