import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { OfferRepository } from "../../../domain/repository/offer-letter.repository";
import {
  RejectOfferRequestDTO,
  RejectOfferResponseDTO,
} from "../../dto/rejectOfferDTO";

export class RejectOfferUseCase implements IUseCase<
  RejectOfferRequestDTO,
  RejectOfferResponseDTO
> {
  constructor(private readonly offerRepo: OfferRepository) {}

  async execute(input: RejectOfferRequestDTO): Promise<RejectOfferResponseDTO> {
    const offer = await this.offerRepo.findById(input.offerId);

    if (!offer) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    if (!offer.belongsToCandidate(input.candidateId)) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED_ACCESS);
    }

    if (!offer.canReject()) {
      throw new ApplicationError(ERROR_CODES.UNABLE_TO_REJECT_OFFER_LETTER);
    }

    offer.reject(input.remarks);

    const updateOffer = await this.offerRepo.update(offer);

    return {
      offerId: updateOffer.id,
      offerNumber: updateOffer.offerNumber,
      status: updateOffer.status,
      rejectedAt: updateOffer.rejectedAt!,
    };
  }
}
