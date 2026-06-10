import { ApplyJobUseCase } from "../../application/usecase/candidate/apply.job.usecase";
import { GetMyApplicationsUseCase } from "../../application/usecase/candidate/GetMyApplicationsUseCase";
import { WithdrawApplicationUseCase } from "../../application/usecase/candidate/withdraw.application.usecase";
import { ApiJobApplicationRepository } from "../../infrastructure/repository/job-application.repository.impl";
import { GetApplicationDetailUseCase } from "../../application/usecase/candidate/MyApplication.indetail.usecase";
import { GetApplicationsByJobUseCase } from "../../application/usecase/recruiter/getApplicationsByJob.usecase";
import { UpdateApplicationStatusUseCase } from "../../application/usecase/recruiter/updateJobApplicationstatus.usecase";
import { GetRecruiterApplicationDetailsUseCase } from "../../application/usecase/recruiter/GetRecruiterApplicationDetailsUseCase";

const jobApplicationRepo = new ApiJobApplicationRepository();

export const applyJobUC = new ApplyJobUseCase(jobApplicationRepo);
export const getMyApplicationsUC = new GetMyApplicationsUseCase(
  jobApplicationRepo,
);
export const WithdrawApplicationUC = new WithdrawApplicationUseCase(
  jobApplicationRepo,
);
export const GetApplicationDetailUC = new GetApplicationDetailUseCase(
  jobApplicationRepo,
);
export const GetApplicationsByJobUC = new GetApplicationsByJobUseCase(
  jobApplicationRepo,
);
export const UpdateApplicationStatusUC = new UpdateApplicationStatusUseCase(
  jobApplicationRepo,
);
export const GetRecruiterApplicationDetailsUC = new GetRecruiterApplicationDetailsUseCase(jobApplicationRepo);

