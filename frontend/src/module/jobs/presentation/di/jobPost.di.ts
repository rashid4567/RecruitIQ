import { CreateJobPostUseCase } from "../../application/usecase/jobPost/createJobPost.useCase";
import { GetJobPostByIdUseCase } from "../../application/usecase/jobPost/getJobPostById.useCase";
import { GetJobPostsUseCase } from "../../application/usecase/jobPost/getJobPosts.useCase";
import { HideJobPostUseCase } from "../../application/usecase/jobPost/hideJobPost.useCase";
import { PublishJobPostUseCase } from "../../application/usecase/jobPost/publishJobPost.useCase";
import { UnhideJobPostUseCase } from "../../application/usecase/jobPost/unHideJobPost.useCase";
import { UpdateJobPostUseCase } from "../../application/usecase/jobPost/updateJobPost.useCase";
import { BlockJobPostUseCase } from "../../application/usecase/jobPost/block-job-post.useCase";
import { UnBlockJobPostUseCase } from "../../application/usecase/jobPost/unBlockJobPost.useCase";
import { ApiJobPostRepository } from "../../infrastructure/repository/ApiJobPostRepository";
const recruiterRepo = new ApiJobPostRepository("recruiter");
export const GetAllRecruiterJobPostUc = new GetJobPostsUseCase(recruiterRepo);
export const CreateJobPostUc = new CreateJobPostUseCase(recruiterRepo);
export const GetRecruiterJobPostByIdUC = new GetJobPostByIdUseCase(
  recruiterRepo,
);
export const UpdateJobPostUc = new UpdateJobPostUseCase(recruiterRepo);
export const HideJobPostUC = new HideJobPostUseCase(recruiterRepo);
export const UnhideJobPostUC = new UnhideJobPostUseCase(recruiterRepo);
export const PublishJobPostUC = new PublishJobPostUseCase(recruiterRepo);
const candidateRepo = new ApiJobPostRepository("candidate");
export const GetAllCandidateJobPostUC = new GetJobPostsUseCase(candidateRepo);
export const GetCandidateJobPostByIdUC = new GetJobPostByIdUseCase(
  candidateRepo,
);
const adminRepo = new ApiJobPostRepository("admin");
export const GetAllAdminJobPostUC = new GetJobPostsUseCase(adminRepo);
export const GetAdminJobPostByIdUC = new GetJobPostByIdUseCase(adminRepo);
export const BlockJobPostUC = new BlockJobPostUseCase(adminRepo);
export const UnBlockJobPostUC = new UnBlockJobPostUseCase(adminRepo);
