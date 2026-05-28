import { GetEmailLogUseCase } from "../../../email/application/usecase/email-logs/GetEmailLogs.usecase";
import { ApiEmailLogRepository } from "../../../email/infrastructure/repositories/ApiEmailLogRepository";

const emailLogRepo = new ApiEmailLogRepository();

export const GetEmailLogUC = new GetEmailLogUseCase(emailLogRepo);