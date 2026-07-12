import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";

import {
  GetRecruiterApplicationsRequestDTO,
  GetRecruiterApplicationsResponseDTO,
} from "../../dto/getRecrruiterApplication.dto";

export class GetRecruiterApplicationsUseCase implements IUseCase<
  GetRecruiterApplicationsRequestDTO,
  GetRecruiterApplicationsResponseDTO
> {
  constructor(private readonly applicationRepo: JobApplicationRepository) {}

  async execute(
    request: GetRecruiterApplicationsRequestDTO,
  ): Promise<GetRecruiterApplicationsResponseDTO> {
    if (!request.recruiterId?.trim()) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const page = request.page ?? 1;
    const limit = request.limit ?? 10;

    const result = await this.applicationRepo.findRecruiterApplications({
      ...request,
      page,
      limit,
    });

    return {
      applications: result.applications.map((application) => ({
        applicationId: application.applicationId,
        applicationNumber: application.applicationNumber,
        candidateId: application.candidateId,
        candidateName: application.candidateName,
        candidateEmail: application.candidateEmail,
        candidateProfileImage: application.candidateProfileImage,
        jobTitle: application.Jobtitle,
        resumeId: application.resumeId,
        fileName: application.fileName,
        status: application.status,
        aiScore: application.aiScore,
        aiRecommendation: application.aiRecommendation,
        appliedAt: application.appliedAt,
      })),

      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: page * limit < result.total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
