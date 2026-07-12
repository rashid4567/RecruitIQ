import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserRepository } from "../../../../auth/domain/repositories/user.repository";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  GetRecruiterInterviewDetailsRequestDTO,
  GetRecruiterInterviewDetailsResponseDTO,
} from "../../dto/getRecruiterInterview.details.dto";

export class GetRecruiterInterviewDetailsUseCase implements IUseCase<
  GetRecruiterInterviewDetailsRequestDTO,
  GetRecruiterInterviewDetailsResponseDTO
> {
  constructor(private readonly interviewRepo: InterviewRepository,
    private readonly userRepo : UserRepository,
    private readonly jobRepo : JobRepository
  ) {}

  async execute(
    input: GetRecruiterInterviewDetailsRequestDTO,
  ): Promise<GetRecruiterInterviewDetailsResponseDTO> {
    const interview = await this.interviewRepo.findById(input.interviewId);

    if (!interview) {
      throw new ApplicationError(ERROR_CODES.INTERVIEW_NOT_FOUND);
    }

    if (!interview.belongsToRecruiter(input.recruiterId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const candidate = await this.userRepo.findById(interview.candidateId);

    if(!candidate){
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND)
    }
    const job = await this.jobRepo.findById(interview.jobId);
    if(!job){
      throw new ApplicationError(ERROR_CODES.JOB_NOT_FOUND)
    }
    const result = interview.toObject();

    return {
      id: result.id!,
      applicationId: result.applicationId,
      jobId: result.jobId,
      candidateId: result.candidateId,
      recruiterId: result.recruiterId,
      candidateName : candidate.fullName,
      roomId: result.roomId,
      round: result.round,
      title: job.title,
      description: result.description,
      mode: result.mode,
      status: result.status,
      candidateResponseStatus: result.candidateResponseStatus,
      candidateRespondedAt: result.candidateRespondedAt,
      candidateResponseMessage: result.candidateResponseMessage,
      rescheduleRequested: result.rescheduleRequested,
      requestedReason: result.requestedReason,
      rescheduleRequestedAt: result.rescheduleRequestedAt,
      scheduledAt: result.scheduledAt,
      durationInMinutes: result.durationInMinutes,
      location: result.location,
      startedAt: result.startedAt,
      endedAt: result.endedAt,
      recruiterJoinedAt: result.recruiterJoinedAt,
      candidateJoinedAt: result.candidateJoinedAt,
      notes: result.notes,
      cancelledReason: result.cancelledReason,
      cancelledBy: result.cancelledBy,
      reminderSent: result.reminderSent,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
