import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  ValidateInterviewRoomAccessRequestDTO,
  ValidateInterviewRoomAccessResponseDTO,
} from "../../dto/ValidateInterviewRoomAccess.dto";

export class ValidateInterviewRoomAccessUseCase implements IUseCase<
  ValidateInterviewRoomAccessRequestDTO,
  ValidateInterviewRoomAccessResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: ValidateInterviewRoomAccessRequestDTO,
  ): Promise<ValidateInterviewRoomAccessResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (input.role === "candidate") {
      if (!interview.belongsToCandidate(input.userId)) {
        throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
      }
    }

    if (input.role === "recruiter") {
      if (!interview.belongsToRecruiter(input.userId)) {
        throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
      }
    }

    if (!interview.canJoin()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_CANNOT_JOINED);
    }

    if (!interview.roomId) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ROOM_NOT_FOUND);
    }

    return {
      interviewId: interview.id!,
      roomId: interview.roomId,
      role: input.role,
    };
  }
}
