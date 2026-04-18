import { CreateJobPostUseCase } from "./application/useCase/jobPost/createJobPost.useCase";
import { GetJobPostByIdUseCase } from "./application/useCase/jobPost/GetJobPostByIdUseCase";
import { GetRecruiterJobPostsUseCase } from "./application/useCase/jobPost/GetRecruiterJobPostsUseCase";
import { ToggleJobPostVisibilityUseCase } from "./application/useCase/jobPost/ToggleJobPostVisibility";
import { UpdateJobPostUseCase } from "./application/useCase/jobPost/UpdateJobPost";
import { JobPostRepository } from "./domain/repositories/JobPostRepository";
import { MongooseJobPostRepository } from "./infrastructure/repositories/mongoose-jobPost.repository";
import { CreateJobPostController } from "./presentation/controller/jobPost/createJobPost.controller";
import { GetAllRecruiterController } from "./presentation/controller/jobPost/getAllJobPost.controller";
import { GetJobPostByIdController } from "./presentation/controller/jobPost/getJobPostById.controller";
import { UpdateJobPostStatusController } from "./presentation/controller/jobPost/jobPostStatus.controller";
import { UpdateJobPostController } from "./presentation/controller/jobPost/updateJobPost.controller";

const jobPostRepository: JobPostRepository = new MongooseJobPostRepository();

const createJobPostUC = new CreateJobPostUseCase(jobPostRepository);
const getRecruiterJobPostsUC = new GetRecruiterJobPostsUseCase(
  jobPostRepository,
);
const updateJobPostUC = new UpdateJobPostUseCase(jobPostRepository);
const toggleJobPostVisibilityUC = new ToggleJobPostVisibilityUseCase(
  jobPostRepository,
);

const getJobPostByIdUC = new GetJobPostByIdUseCase(jobPostRepository)

export const createJobPostContoller = new CreateJobPostController(
  createJobPostUC,
);
export const getRecruiterJobPostController = new GetAllRecruiterController(
  getRecruiterJobPostsUC,
);
export const updateJobPostController = new UpdateJobPostController(
  updateJobPostUC,
);
export const jobPostStatusController = new UpdateJobPostStatusController(
  toggleJobPostVisibilityUC,
);

export const getJobPostByIdController = new GetJobPostByIdController(getJobPostByIdUC);
