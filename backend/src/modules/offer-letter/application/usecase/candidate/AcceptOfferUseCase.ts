import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  AcceptOfferRequestDTO,
  AcceptOfferResponseDTO,
} from "../../dto/AcceptOfferDTO";

export class AcceptOfferUseCase implements IUseCase<
  AcceptOfferRequestDTO,
  AcceptOfferResponseDTO
> {
  constructor(private readonly offerRepo: OfferRepository) {}

  async execute(input: AcceptOfferRequestDTO): Promise<AcceptOfferResponseDTO> {
    const offer = await this.offerRepo.findById(input.offerId);

    if (!offer) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (offer.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }

    offer.accept(input.remarks);

    const updatedOffer = await this.offerRepo.update(offer);
    return {
      offerId: updatedOffer.id,
      offerNumber: updatedOffer.offerNumber,
      status: updatedOffer.status,
      acceptedAt: updatedOffer.acceptedAt!,
    };
  }
}
