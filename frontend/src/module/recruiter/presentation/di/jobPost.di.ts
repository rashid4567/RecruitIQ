import { CreateJobPostUseCase } from "../../Application/use-Cases/jobPost/createJobPost.useCase";
import { GetJobPostByIdUseCase } from "../../Application/use-Cases/jobPost/getJobPostById.useCase";
import { GetJobPostsUseCase } from "../../Application/use-Cases/jobPost/getJobPosts.useCase";
import { hideJobPostUseCase } from "../../Application/use-Cases/jobPost/hideJobPost.useCase";
import { unhideJobPostUseCase } from "../../Application/use-Cases/jobPost/unHideJobPost.useCase";
import { ApiJobPostRepository } from "../../infrastructure/repositories/ApiJobPostRepository";

const jobPostRepo = new ApiJobPostRepository();

export const GetAllRecruiterJobPostUc = new GetJobPostsUseCase(jobPostRepo);
export const CreateJobPostUc = new CreateJobPostUseCase(jobPostRepo);
export const GetJobPostByIdUC = new GetJobPostByIdUseCase(jobPostRepo)
export const hideJobPostUC = new hideJobPostUseCase(jobPostRepo);
export const unhideJobPostUC = new unhideJobPostUseCase(jobPostRepo);

