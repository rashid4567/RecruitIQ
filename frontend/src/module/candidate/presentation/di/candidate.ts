import { CompleteCandidateProfileUseCase } from "../../Application/CompleteCandidateProfileUseCase";
import { GetCandidateProfileUseCase } from "../../Application/GetCandidate-Profile.useCase";
import { UpdateCandidateProfile } from "../../Application/updateCanidate.profile-useCase";
import { ApiCandidateRepository } from "../../infrastructure/repositories/ApiCandidateRepository";

const candidateRepo = new ApiCandidateRepository();

export const GetCandidateUc = new GetCandidateProfileUseCase(candidateRepo);
export const updateCandidateUc = new UpdateCandidateProfile(candidateRepo);
export const completeProfileUC = new CompleteCandidateProfileUseCase(candidateRepo)
