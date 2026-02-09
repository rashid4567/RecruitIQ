import { GetRecruiterListUseCase } from "../../application/useCases/get-recruiters.usecase";
import { GetRecruiterProfileUseCase } from "../../application/useCases/getRecruiterProfile.useCase";
import { RejectRecruiterUseCase } from "../../application/useCases/rejectRecruiter.useCase";
import { VerifyRecruiterUseCase } from "../../application/useCases/verifyRecruiter.useCase";
import { ApiRecruiterRepository } from "../../infrastructure/repositories/ApiRecruiterRepository";

const recruiterRepo = new ApiRecruiterRepository();

export const getRecruiterListUC = new GetRecruiterListUseCase(recruiterRepo)
export const verifyRecruiterUC = new VerifyRecruiterUseCase(recruiterRepo);
export const rejectRecruiterUC = new RejectRecruiterUseCase(recruiterRepo);
export const getRecruiterProfileUC = new GetRecruiterProfileUseCase(recruiterRepo);

