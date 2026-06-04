import { ApplyJobUseCase } from "../../application/usecase/apply.job.usecase";
import { ApiJobApplicationRepository } from "../../infrastructure/repository/job-application.repository.impl";

const jobApplicationRepo = new ApiJobApplicationRepository();

export const applyJobUC = new ApplyJobUseCase(jobApplicationRepo);
