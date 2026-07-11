import { OfferStatus } from "../../domain/entity/offer-letter.entity";

export interface ViewOfferRequestDTO {
  offerId: string;
  candidateId: string;
}

export interface ViewOfferResponseDTO {
  offerId: string;
  status: OfferStatus;
  viewedAt?: Date;
}