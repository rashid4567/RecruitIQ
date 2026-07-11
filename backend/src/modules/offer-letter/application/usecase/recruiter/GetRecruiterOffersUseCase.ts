import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  GetRecruiterOffersRequestDTO,
  GetRecruiterOffersResponseDTO,
} from "../../dto/getRecruiterofferDTO";

export class GetRecruiterOffersUseCase implements IUseCase<
  GetRecruiterOffersRequestDTO,
  GetRecruiterOffersResponseDTO[]
> {
  constructor(private readonly offerRepository: OfferRepository) {}

  async execute(
    request: GetRecruiterOffersRequestDTO,
  ): Promise<GetRecruiterOffersResponseDTO[]> {
    const offers = await this.offerRepository.findByRecruiterId(
      request.recruiterId,
    );

    

    return offers.map((offer) => ({
      id: offer.id,
      offerNumber: offer.offerNumber,
      applicationId: offer.applicationId,
      candidateId: offer.candidateId,
      jobId: offer.jobId,
      companyName: offer.companyName,
      jobTitle: offer.jobTitle,
      annualCTC: offer.annualCTC,
      currency: offer.currency,
      employmentType: offer.employmentType,
      workLocation: offer.workLocation,
      joiningDate: offer.joiningDate,
      offerDate: offer.offerDate,
      expiryDate: offer.expiryDate,
      status: offer.status,
      sentAt: offer.sentAt,
      viewedAt: offer.viewedAt,
      acceptedAt: offer.acceptedAt,
      rejectedAt: offer.rejectedAt,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    }));
  }
}
