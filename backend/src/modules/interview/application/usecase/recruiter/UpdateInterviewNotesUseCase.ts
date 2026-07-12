import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  UpdateInterviewNotesRequestDTO,
  UpdateInterviewNotesResponseDTO,
} from "../../dto/update-interview-notes.dto";

export class UpdateInterviewNotesUseCase implements IUseCase<
  UpdateInterviewNotesRequestDTO,
  UpdateInterviewNotesResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository) {}

  async execute(
    input: UpdateInterviewNotesRequestDTO,
  ): Promise<UpdateInterviewNotesResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);
    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    if (!interview.isCompleted()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_COMPLETED);
    }

    interview.updateNotes(input.notes);

    const savedInterview = await this.interviewRepo.save(interview);
    const result = savedInterview.toObject();

    return {
      id: result.id!,
      notes: result.notes ?? "",
      updatedAt: result.updatedAt,
    };
  }
}
