import { ListEmailUseCase } from "../../Application/use-Cases/email.logs/list-email-logs.usecase";
import { FileEmailLogRepository } from "../../Infrastructure/repositories/file-email-log.repository";
import { EmailLogsController } from "../controller/email.logs.mangment/email-logs.controller";

const emailLogoRepo = new FileEmailLogRepository();
const listLogsUC = new ListEmailUseCase(emailLogoRepo);

export const emailLogsController = new EmailLogsController(listLogsUC);
