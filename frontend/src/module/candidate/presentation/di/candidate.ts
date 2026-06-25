import { CompleteCandidateProfileUseCase } from "../../Application/usecase/CompleteCandidateProfileUseCase";
import { GetCandidateProfileUseCase } from "../../Application/usecase/GetCandidate-Profile.useCase"; 
import { UpdateCandidateProfile } from "../../Application/usecase/updateCanidate.profile-useCase";
import { ApiCandidateRepository } from "../../infrastructure/repositories/ApiCandidateRepository";

const candidateRepo = new ApiCandidateRepository();

export const GetCandidateUc = new GetCandidateProfileUseCase(candidateRepo);
export const updateCandidateUc = new UpdateCandidateProfile(candidateRepo);
export const completeProfileUC = new CompleteCandidateProfileUseCase(candidateRepo)
