import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { DOMAIN_ERROR_CODES } from "../../../../../shared/constants/domain.error.code";
import { DomainError } from "../../../../../shared/errors/domain.error";

import { OfferRepository } from "../../../domain/repository/offer-letter.repository";

import {
  GetOfferDetailsRequestDTO,
  GetOfferDetailsResponseDTO,
} from "../../dto/GetOfferDetailsDTO";

export class GetOfferDetailsUseCase implements IUseCase<
  GetOfferDetailsRequestDTO,
  GetOfferDetailsResponseDTO
> {
  constructor(private readonly offerRepository: OfferRepository) {}

  async execute(
    request: GetOfferDetailsRequestDTO,
  ): Promise<GetOfferDetailsResponseDTO> {
    const offer = await this.offerRepository.findById(request.offerId);

    if (!offer) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_NOT_FOUND);
    }

    return {
      id: offer.id,
      offerNumber: offer.offerNumber,
      applicationId: offer.applicationId,
      jobId: offer.jobId,
      candidateId: offer.candidateId,
      recruiterId: offer.recruiterId,
      companyName: offer.companyName,
      jobTitle: offer.jobTitle,
      annualCTC: offer.annualCTC,
      currency: offer.currency,
      employmentType: offer.employmentType,
      department: offer.department,
      workLocation: offer.workLocation,
      joiningDate: offer.joiningDate,
      probationPeriod: offer.probationPeriod,
      benefits: offer.benefits,
      notes: offer.notes,
      offerDate: offer.offerDate,
      expiryDate: offer.expiryDate,
      status: offer.status,
      offerLetterUrl: offer.offerLetterUrl,
      sentAt: offer.sentAt,
      viewedAt: offer.viewedAt,
      acceptedAt: offer.acceptedAt,
      rejectedAt: offer.rejectedAt,
      candidateRemarks: offer.candidateRemarks,
    };
  }
}
