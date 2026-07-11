import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  GetCandidateOfferRequestDTO,
  GetCandidateOfferResponseDTO,
} from "../../dto/getCandidateOfferDTO";

export class GetCandidateOfferUseCase implements IUseCase<
  GetCandidateOfferRequestDTO,
  GetCandidateOfferResponseDTO
> {
  constructor(private readonly offerRepo: OfferRepository) {}

  async execute(
    input: GetCandidateOfferRequestDTO,
  ): Promise<GetCandidateOfferResponseDTO> {
    const offer = await this.offerRepo.findById(input.offerId);

    if (!offer) {
      throw new ApplicationError(ERROR_CODES.OFFER_NOT_FOUND);
    }

    if (offer.candidateId !== input.candidateId) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }

    if (offer.canView() && !offer.viewedAt) {
      offer.markViewed();

      await this.offerRepo.update(offer);
    }

    return {
      id: offer.id,
      offerNumber: offer.offerNumber,
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
      viewedAt: offer.viewedAt,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }
}
