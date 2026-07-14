import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import {
  ApplicationDetailResponseDTO,
  GetApplicationDetailRequestDTO,
} from "../../dto/application-detail.response.dto";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { OfferRepository } from "../../../../offer-letter/domain/repository/offer-letter.repository";

export class GetApplicationDetailUseCase implements IUseCase<
  GetApplicationDetailRequestDTO,
  ApplicationDetailResponseDTO
> {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly offerRepo: OfferRepository,
  ) {}

  async execute(
    request: GetApplicationDetailRequestDTO,
  ): Promise<ApplicationDetailResponseDTO> {
    if (!request.candidateId) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }

    if (!request.applicationId) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    const application = await this.applicationRepo.findById(
      request.applicationId,
    );
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    if (!application.belongsToCandidate(request.candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }
    const job = await this.jobRepo.findById(application.jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    const offer = await this.offerRepo.findByApplicationId(application.id);

    return {
      application: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        jobId: application.jobId,
        candidateId: application.candidateId,
        recruiterId: application.recruiterId,
        resumeId: application.resumeId,
        appliedResumeFileName: application.appliedResumeFileName,
        appliedResumeFileKey: application.appliedResumeFileKey,
        status: application.status,
        appliedAt: application.appliedAt,
        updatedAt: application.updatedAt,
        coverLetter: application.coverLetter,
        rejectionReason: application.rejectionReason,
        interview: application.interview,
      },
      job: {
        id: job.id,
        companyName: job.candidateView().companyName,
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

      offer: offer
        ? {
            id: offer.id,
            status: offer.status,
            expiryDate: offer.expiryDate,
            offerLetterUrl: `/candidate/offer/${offer.id}`,
          }
        : null,
    };
  }
}
