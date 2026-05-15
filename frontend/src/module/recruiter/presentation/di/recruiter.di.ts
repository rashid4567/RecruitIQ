import { CompleteRecruiterProfileUseCase } from "../../Application/use-Cases/profile/CompleteProfile-useCase"; 
import { GetRecruiterProfileUseCase } from "../../Application/use-Cases/profile/getProfile-useCase";
import { UpdateRecruiterProfileUseCase } from "../../Application/use-Cases/profile/updateProfile-useCase";
import { ApiRecruiterRepository } from "../../infrastructure/repositories/ApiRecruiterRepository";

const recruiterRepo = new ApiRecruiterRepository();

export const GetRecruiterProfileUc = new GetRecruiterProfileUseCase(recruiterRepo);
export const updateRecruiterUc = new UpdateRecruiterProfileUseCase(recruiterRepo);
export const completeProfileUC = new CompleteRecruiterProfileUseCase(recruiterRepo)