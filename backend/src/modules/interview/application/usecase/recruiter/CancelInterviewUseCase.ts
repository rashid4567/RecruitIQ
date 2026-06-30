import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  CancelInterviewRequestDTO,
  CancelInterviewResponseDTO,
} from "../../dto/cancel-interview.dto";

export class RecruiterInterviewCancelUseCase implements IUseCase<
  CancelInterviewRequestDTO,
  CancelInterviewResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    input: CancelInterviewRequestDTO,
  ): Promise<CancelInterviewResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }
    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }
    if (!interview.canCancel()) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_IS_NOT_ABLE_CANCEL);
    }
    interview.cancel(input.reason, input.recruiterId);
    const savedInterview = await this.interviewRepo.save(interview);
    const application = await this.applicationRepo.findById(
      interview.applicationId,
    );
    if (application) {
      application.markInterviewCancelled();
      await this.applicationRepo.save(application);
    }
    const result = savedInterview.toObject();
    return {
      id: result.id!,
      status: result.status,
      cancelledReason: result.cancelledReason!,
      cancelledBy: result.cancelledBy!,
      updatedAt: result.updatedAt,
    };
  }
}
