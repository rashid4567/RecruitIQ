import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewRepository } from "../../../domain/repository/interview.repository";
import {
  GetCandidateInterviewsRequestDTO,
  GetCandidateInterviewsResponseDTO,
} from "../../dto/getCandidateInterviews.dto";

export class GetCandidateInterviewUseCase implements IUseCase<
  GetCandidateInterviewsRequestDTO,
  GetCandidateInterviewsResponseDTO
> {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  async execute(
    request: GetCandidateInterviewsRequestDTO,
  ): Promise<GetCandidateInterviewsResponseDTO> {
    const interviews = await this.interviewRepository.findByCandidate(
      request.candidateId,
    );

    return {
      interviews: interviews.map((interview) => {
        const data = interview.toObject();

        return {
          id: interview.id,
          applicationId: data.applicationId,
          jobId: data.jobId,
          title: data.title,
          round: data.round,
          mode: data.mode,
          status: data.status,
          scheduledAt: data.scheduledAt,
          durationInMinutes: data.durationInMinutes,
          meetingLink: data.meetingLink,
          location: data.location,
          canJoin: interview.canJoin(),
          createdAt: data.createdAt,
        };
      }),
    };
  }
}
