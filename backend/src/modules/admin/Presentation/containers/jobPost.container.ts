import { GetAllJobPostsUseCase } from "../../Application/use-Cases/jobPost-mangment/getAll-JobPost.useCase";
import { GetJobPostByIdUseCase } from "../../Application/use-Cases/jobPost-mangment/getJobPostById.useCase";
import { BlockJobPostUseCase, UnblockJobPostUseCase } from "../../Application/use-Cases/jobPost-mangment/update-JobPost.status.usecase";
import { JobPostRepostory } from "../../Domain/repositories/jobPost-repository";
import { MongooseJobPostRepository } from "../../Infrastructure/repositories/mongoose-jobPost.repository";
import { BlockJobPostController } from "../controller/jobPost-mangment/blockJobPost.controller";
import { GetAllJobPostController } from "../controller/jobPost-mangment/getAllJobPost.controller";
import { GetJobPostByIdController } from "../controller/jobPost-mangment/getJobPostById.controller";
import { UnblockJobPostController } from "../controller/jobPost-mangment/unblock.JobPost.controller";

const JobPostRepo : JobPostRepostory = new MongooseJobPostRepository();

const getJobPostUC = new GetAllJobPostsUseCase(JobPostRepo);
const getJobByIdUC = new GetJobPostByIdUseCase(JobPostRepo);
const blockJobPost = new BlockJobPostUseCase(JobPostRepo);
const unblockJobPost = new UnblockJobPostUseCase(JobPostRepo);

export const getJobPostController = new GetAllJobPostController(getJobPostUC)
export const getJobPopstByIdcontroller = new GetJobPostByIdController(getJobByIdUC)
export const blockJobPostController = new BlockJobPostController(blockJobPost);
export const unblockJobPostController = new UnblockJobPostController(unblockJobPost);