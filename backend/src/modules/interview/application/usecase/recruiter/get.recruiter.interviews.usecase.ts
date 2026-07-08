import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApplicationStatus } from "../../../../job-application/domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../../job-application/domain/repository/job-application.repository";
import { CandidateResponseStatus } from "../../../domain/entity/interview.entity";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  GetRecruiterInterviewsRequestDTO,
  GetRecruiterInterviewsResponseDTO,
} from "../../dto/getRecruiter.interviews.dto";

export class GetRecruiterInterviewsUseCase implements IUseCase<
  GetRecruiterInterviewsRequestDTO,
  GetRecruiterInterviewsResponseDTO[]
> {
  constructor(
    private readonly interviewRepo: InterviewRepository,
    private readonly applicationRepo: JobApplicationRepository,
  ) {}

  async execute(
    input: GetRecruiterInterviewsRequestDTO,
  ): Promise<GetRecruiterInterviewsResponseDTO[]> {
    const interviews = await this.interviewRepo.findByRecruiter(
      input.recruiterId,
      input.page,
      input.limit,
    );

    const applications =
      await this.applicationRepo.findRecruiterInterviewApplications(
        input.recruiterId,
        [ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW_SCHEDULED],
      );

    const interviewMap = new Map(
      interviews.map((interview) => [interview.applicationId, interview]),
    );

    return applications
      .map((application) => {
        const interview = interviewMap.get(application.applicationId);

        if (!interview) {
          return {
            applicationId: application.applicationId,
            jobId: application.jobId,
            jobTitle: application.jobTitle,
            candidateId: application.candidateId,
            candidateName: application.candidateName,
            candidateEmail: application.candidateEmail,
            candidateProfileImage: application.candidateProfileImage,
            recruiterId: application.recruiterId,
            applicationStatus: application.status,
            candidateResponseStatus: CandidateResponseStatus.PENDING,
            rescheduleRequested: false,
          };
        }

        const result = interview.toObject();

        return {
          interviewId: result.id,
          applicationId: application.applicationId,
          jobId: application.jobId,
          jobTitle: application.jobTitle,
          candidateId: application.candidateId,
          candidateName: application.candidateName,
          candidateEmail: application.candidateEmail,
          candidateProfileImage: application.candidateProfileImage,
          recruiterId: application.recruiterId,
          roomId: result.roomId,
          mode: result.mode,
          applicationStatus: application.status,
          interviewStatus: result.status,
          candidateResponseStatus: result.candidateResponseStatus,
          rescheduleRequested: result.rescheduleRequested,
          title: result.title,
          round: result.round,
          scheduledAt: result.scheduledAt,
          durationInMinutes: result.durationInMinutes,
          location: result.location,
        };
      })
      .sort((a, b) => {
        const dateA = a.scheduledAt
          ? new Date(a.scheduledAt).getTime()
          : Number.MAX_SAFE_INTEGER;

        const dateB = b.scheduledAt
          ? new Date(b.scheduledAt).getTime()
          : Number.MAX_SAFE_INTEGER;

        return dateA - dateB;
      });
  }
}
