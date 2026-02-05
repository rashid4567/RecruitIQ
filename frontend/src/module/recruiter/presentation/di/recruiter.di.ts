import { CompleteRecruiterProfileUseCase } from "../../Application/use-Cases/CompleteProfile-useCase"; 
import { GetRecruiterProfileUseCase } from "../../Application/use-Cases/getProfile-useCase";
import { UpdateRecruiterPrifileUseCase } from "../../Application/use-Cases/updateProfile-useCase";
import { ApiRecruiterRepository } from "../../infrastructure/repositories/ApiRecruiterRepository";

const recruiterRepo = new ApiRecruiterRepository();

export const GetRecruiterProfileUc = new GetRecruiterProfileUseCase(recruiterRepo);
export const updateRecruiterUc = new UpdateRecruiterPrifileUseCase(recruiterRepo);
export const completeProfileUC = new CompleteRecruiterProfileUseCase(recruiterRepo)