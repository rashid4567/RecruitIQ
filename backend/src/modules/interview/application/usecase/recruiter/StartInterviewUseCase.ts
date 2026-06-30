import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  StartInterviewRequestDTO,
  StartInterviewResponseDTO,
} from "../../dto/start-interview.dto";

export class StartInterviewUseCase implements IUseCase<
  StartInterviewRequestDTO,
  StartInterviewResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: StartInterviewRequestDTO,
  ): Promise<StartInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.canStart()) {
      throw new ApplicationError(ERROR_CODES.INVALID_INTERVIEW_STATUS_TO_START);
    }
    interview.start();

    const savedInterview = await this.interviewRepo.save(interview);

    const result = savedInterview.toObject();

    return {
      id: result.id!,
      status: result.status,
      startedAt: result.startedAt,
      updatedAt: result.updatedAt,
    };
  }
}
