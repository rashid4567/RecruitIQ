import { GetAllJobPostsUseCase } from "../../Application/use-Cases/jobPost-management/getAll-JobPost.useCase";
import { GetJobPostByIdUseCase } from "../../Application/use-Cases/jobPost-management/getJobPostById.useCase";
import { BlockJobPostUseCase, UnblockJobPostUseCase } from "../../Application/use-Cases/jobPost-management/update-JobPost.status.usecase";
import { JobPostRepostory } from "../../Domain/repositories/jobPost-repository";
import { MongooseJobPostRepository } from "../../Infrastructure/repositories/mongoose-jobPost.repository";
import { BlockJobPostController } from "../controller/jobPost-management/blockJobPost.controller";
import { GetAllJobPostController } from "../controller/jobPost-management/getAllJobPost.controller";
import { GetJobPostByIdController } from "../controller/jobPost-management/getJobPostById.controller";
import { UnblockJobPostController } from "../controller/jobPost-management/unblock.JobPost.controller";

const JobPostRepo : JobPostRepostory = new MongooseJobPostRepository();

const getJobPostUC = new GetAllJobPostsUseCase(JobPostRepo);
const getJobByIdUC = new GetJobPostByIdUseCase(JobPostRepo);
const blockJobPost = new BlockJobPostUseCase(JobPostRepo);
const unblockJobPost = new UnblockJobPostUseCase(JobPostRepo);

export const getJobPostController = new GetAllJobPostController(getJobPostUC)
export const getJobPopstByIdcontroller = new GetJobPostByIdController(getJobByIdUC)
export const blockJobPostController = new BlockJobPostController(blockJobPost);
export const unblockJobPostController = new UnblockJobPostController(unblockJobPost);