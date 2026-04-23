import { BlockJobPostUseCase } from "../../application/useCases/jobPost-managment/blockJobPost.useCase";
import { GetJobPostListUseCase } from "../../application/useCases/jobPost-managment/getJobPost.useCase";
import { GetJobPostByIdUseCase } from "../../application/useCases/jobPost-managment/getJobPostById.useCase";
import { UnblockJobPostUseCase } from "../../application/useCases/jobPost-managment/unblockJobPost.useCase";
import { ApiJobPostRepository } from "../../infrastructure/repositories/Api-jobPost.repositiry";

const repo = new ApiJobPostRepository();

export const getAllJobpostUC = new GetJobPostListUseCase(repo);
export const getJobPostByIdUC = new GetJobPostByIdUseCase(repo);
export const blockJobPostUC = new BlockJobPostUseCase(repo);
export const unblockJobPostUC = new UnblockJobPostUseCase(repo)