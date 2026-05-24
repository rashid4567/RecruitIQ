import { ListEmailLogsUseCase } from "../../application/usecase/email.logs/list-email-logs.usecase";
import { FileEmailLogRepository } from "../../infrastructure/repositories/file-email-log.repository";
import { EmailLogsController } from "../controller/email.logs.management/email-logs.controller"; 

const emailLogoRepo = new FileEmailLogRepository();
const listLogsUC = new ListEmailLogsUseCase(emailLogoRepo);

export const emailLogsController = new EmailLogsController(listLogsUC);
