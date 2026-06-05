import { ApplyJobUseCase } from "../../application/usecase/apply.job.usecase";
import { GetMyApplicationsUseCase } from "../../application/usecase/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/withdraw.application.usecase";
import { ApiJobApplicationRepository } from "../../infrastructure/repository/job-application.repository.impl";

const jobApplicationRepo = new ApiJobApplicationRepository();

export const applyJobUC = new ApplyJobUseCase(jobApplicationRepo);
export const getMyApplicationsUC = new GetMyApplicationsUseCase(
  jobApplicationRepo,
);
export const WithdrawApplicationUC = new WithdrawApplicationUseCase(jobApplicationRepo);