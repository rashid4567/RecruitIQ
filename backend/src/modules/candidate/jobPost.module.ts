import { GetAllJobPostsUseCase } from "./application/use-cases/jobPost/getAllJobPost.useCase";
import { GetJobPostByIdUseCase } from "./application/use-cases/jobPost/getJobPostById.useCase";
import { CandidateJobPostRepository } from "./domain/repositories/candidatejobpost.repository";
import { MongooseCandidateJobPostRepository } from "./infrastructure/repositories/mongoose-jobPost.repository";
import { GetAllJobPostsController } from "./presentation/controller/jobPostController/AllJobPost.controller";
import { GetJobPostByIdController } from "./presentation/controller/jobPostController/getJobPostById.controller";

const jobPostRepository : CandidateJobPostRepository = new MongooseCandidateJobPostRepository();
const getAllJobPostUC = new GetAllJobPostsUseCase(jobPostRepository);
const getJobPostByIdUC = new GetJobPostByIdUseCase(jobPostRepository);


export const getJobPostController = new GetAllJobPostsController(getAllJobPostUC);
export const getJobPostByIdController = new GetJobPostByIdController(getJobPostByIdUC)