import { OfferStatus } from "../../domain/entity/offer-letter.entity";

export interface AcceptOfferRequestDTO {
  offerId: string;
  candidateId: string;
  remarks?: string;
}

export interface AcceptOfferResponseDTO {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
  acceptedAt: Date;
}