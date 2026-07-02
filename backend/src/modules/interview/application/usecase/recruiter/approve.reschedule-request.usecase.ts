import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  ApproveRescheduleRequestDTO,
  ApproveRescheduleResponseDTO,
} from "../../dto/approve-reschedule-request.dto";

export class ApproveRescheduleRequestUseCase implements IUseCase<
  ApproveRescheduleRequestDTO,
  ApproveRescheduleResponseDTO
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
  ) {}

  async execute(
    input: ApproveRescheduleRequestDTO,
  ): Promise<ApproveRescheduleResponseDTO> {
    const interiew = await this.interviewRepo.findById(input.interviewId);

    if (!interiew) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interiew.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_ACCESS_DENIED);
    }

    interiew.approveReschedule();
    const savedInterview = await this.interviewRepo.save(interiew);
    const response = savedInterview.toObject();

    return {
      id: response.id!,
      rescheduleRequested: response.rescheduleRequested,
      updatedAt: response.updatedAt,
    };
  }

}
