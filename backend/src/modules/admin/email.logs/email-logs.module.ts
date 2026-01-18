import { ListEmailUseCase } from "./application/use-cases/list-email-logs.usecase";
import { FileEmailLogRepository } from "./infrastructure/repositories/file-email-log.repository";
import { EmailLogsController } from "./presentation/controllers/email-logs.controller";

const emailLogoRepo = new FileEmailLogRepository();
const listLogsUC = new ListEmailUseCase(emailLogoRepo)

export const emailLogsController = new EmailLogsController(
    listLogsUC,
)