import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  MarkRecruiterJoinedRequestDTO,
  MarkRecruiterJoinedResponseDTO,
} from "../../dto/mark-recruiter-joined.dto";

export class MarkRecruiterJoinedUseCase implements IUseCase<
  MarkRecruiterJoinedRequestDTO,
  MarkRecruiterJoinedResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: MarkRecruiterJoinedRequestDTO,
  ): Promise<MarkRecruiterJoinedResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canJoin()) {
  throw new ApplicationError(
    ERROR_CODES.INTERVIEW_CANNOT_BE_JOINED,
  );
}

    interview.markRecruiterJoined();

    const savedInterview = await this.interviewRepo.save(interview);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      recruiterJoinedAt: result.recruiterJoinedAt,
      status: result.status,
      updatedAt: result.updatedAt,
    };
  }
}
