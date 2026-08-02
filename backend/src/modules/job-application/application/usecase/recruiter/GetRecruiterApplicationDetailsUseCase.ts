import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { InterviewStatus } from "../../../../interview/domain/entity/interview.entity";
import { InterviewRepository } from "../../../../interview/domain/repository/interview.repository";

import { OfferRepository } from "../../../../offer-letter/domain/repository/offer-letter.repository";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";

import {
  GetRecruiterApplicationDetailsRequestDTO,
  RecruiterApplicationDetailsResponseDTO,
} from "../../dto/getRecruiterApplicationDetail.dto";

export class GetRecruiterApplicationDetailsUseCase implements IUseCase<
  GetRecruiterApplicationDetailsRequestDTO,
  RecruiterApplicationDetailsResponseDTO
> {
  constructor(
    private readonly applicationRepository: JobApplicationRepository,
    private readonly offerRepo: OfferRepository,
    private readonly interviewRepo : InterviewRepository
  ) {}

  async execute(
    request: GetRecruiterApplicationDetailsRequestDTO,
  ): Promise<RecruiterApplicationDetailsResponseDTO> {
    const application =
      await this.applicationRepository.findApplicationDetailsForRecruiter(
        request.applicationId,
      );

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (application.recruiterId !== request.recruiterId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACTION);
    }

    const offer = await this.offerRepo.findByApplicationId(
      application.applicationId,
    );

    const interview = await this.interviewRepo.findByApplicationId(application.applicationId)

    return {
      ...application,
      interview: interview
        ? {
              id: interview.id!,
              scheduledAt : interview.scheduledAt,
              status: interview.status,
              completed:
                  interview.status === InterviewStatus.COMPLETED,
          }
        : undefined,
      offer: offer
        ? {
            id: offer.id,
            offerNumber: offer.offerNumber,
            status: offer.status,
            companyName: offer.companyName,
            jobTitle: offer.jobTitle,
            department: offer.department,
            workLocation: offer.workLocation,
            annualCTC: offer.annualCTC,
            currency: offer.currency,
            joiningDate: offer.joiningDate,
            probationPeriod: offer.probationPeriod,
            benefits: offer.benefits,
            notes: offer.notes,
            offerDate: offer.offerDate,
            expiryDate: offer.expiryDate,
            offerLetterUrl: offer.offerLetterUrl,
            sentAt: offer.sentAt,
            viewedAt: offer.viewedAt,
            acceptedAt: offer.acceptedAt,
            rejectedAt: offer.rejectedAt,
            candidateSignatureUrl : offer.candidateSignatureUrl,
            candidateRemarks: offer.candidateRemarks,
          }
        : undefined,
        
    };
  }
}
