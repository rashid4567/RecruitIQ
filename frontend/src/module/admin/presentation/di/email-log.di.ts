import { GetEmailLogUseCase } from "../../application/useCases/email-logs/GetEmailLogs.usecase";
import { ApiEmailLogRepository } from "../../infrastructure/repositories/ApiEmailLogRepository";

const emailLogRepo = new ApiEmailLogRepository();

export const GetEmailLogUC = new GetEmailLogUseCase(emailLogRepo);