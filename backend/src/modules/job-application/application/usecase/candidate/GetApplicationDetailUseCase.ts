import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ApplicationDetailResponseDTO } from "../../dto/application-detail.response.dto";

export class GetApplicationDetailUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  async execute(
    candidateId: string,
    applicationId: string,
  ): Promise<ApplicationDetailResponseDTO> {
    if (!candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    if (!applicationId) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    if (!application.belongsToCandidate(candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    const job = await this.jobRepo.findById(application.jobId);

    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return {
      application: {
        id: application.id,
        jobId: application.jobId,
        candidateId: application.candidateId,
        recruiterId: application.recruiterId,
        resumeId: application.resumeId,
        status: application.status,
        appliedAt: application.appliedAt,
        updatedAt: application.updatedAt,
        coverLetter: application.coverLetter,
        rejectionReason: application.rejectionReason,
        interview: application.interview,
      },

      job: {
        id: job.id,
        companyName : job.candidateView().companyName,
        title: job.candidateView().title,
        description: job.candidateView().description,
        responsibilities: job.candidateView().responsibilities,
        requirements: job.candidateView().requirements,
        requiredSkills: job.candidateView().requiredSkills,
        preferredSkills: job.candidateView().preferredSkills,
        experienceMin: job.candidateView().experienceMin,
        experienceMax: job.candidateView().experienceMax,
        location: job.candidateView().location,
        salary: job.candidateView().salary,
        department: job.candidateView().department,
        jobType: job.candidateView().jobType,
        isRemote: job.candidateView().isRemote,
        positions: job.candidateView().positions,
        postedOn: job.candidateView().postedOn,
        expiresAt: job.candidateView().expiresAt,
      },
    };
  }
}
