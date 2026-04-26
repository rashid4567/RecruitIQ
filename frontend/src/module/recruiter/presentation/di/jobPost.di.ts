import { CreateJobPostUseCase } from "../../Application/use-Cases/jobPost/createJobPost.useCase";
import { GetJobPostByIdUseCase } from "../../Application/use-Cases/jobPost/getJobPostById.useCase";
import { GetJobPostsUseCase } from "../../Application/use-Cases/jobPost/getJobPosts.useCase";
import { HideJobPostUseCase } from "../../Application/use-Cases/jobPost/hideJobPost.useCase";
import { PublishJobPostUseCase } from "../../Application/use-Cases/jobPost/publishJobPost.useCase";
import { UnhideJobPostUseCase } from "../../Application/use-Cases/jobPost/unHideJobPost.useCase";
import { UpdateJobPostUseCase } from "../../Application/use-Cases/jobPost/updateJobPost.useCase";

import { ApiJobPostRepository } from "../../infrastructure/repositories/ApiJobPostRepository";

const jobPostRepo = new ApiJobPostRepository();

export const GetAllRecruiterJobPostUc = new GetJobPostsUseCase(jobPostRepo);
export const CreateJobPostUc = new CreateJobPostUseCase(jobPostRepo);
export const GetJobPostByIdUC = new GetJobPostByIdUseCase(jobPostRepo)
export const UpdateJobPostUc = new UpdateJobPostUseCase(jobPostRepo)
export const hideJobPostUC = new HideJobPostUseCase(jobPostRepo);
export const unhideJobPostUC = new UnhideJobPostUseCase(jobPostRepo);
export const publishJobPostUC = new PublishJobPostUseCase(jobPostRepo);
