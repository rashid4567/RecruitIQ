import {
  GetCandidateProfileResponseDTO,
} from "../../dto/candidate-profile.dto";
import { UpdateCandidateProfileDTO } from "../../dto/update-candidate-profile.dto";
import { CompleteCandidateProfileDTO } from "../../dto/complete-candidate-profile.dto";
import { updatePasswordDTO } from "../../dto/update-candidate-password.dto";

export interface GetCandidateProfileUC {
  execute(userId: string): Promise<GetCandidateProfileResponseDTO>;
}

export interface UpdateCandidateProfileUC {
  execute(
    userId: string,
    data: UpdateCandidateProfileDTO
  ): Promise<GetCandidateProfileResponseDTO>;
}

export interface CompleteCandidateProfileUC {
  execute(
    userId: string,
    data: CompleteCandidateProfileDTO
  ): Promise<GetCandidateProfileResponseDTO>;
}

export interface UpdatePasswordUC {
  execute(
    userId: string,
    data : updatePasswordDTO,
  ): Promise<void>;
}
