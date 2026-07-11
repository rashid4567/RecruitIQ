import { OfferStatus } from "../../domain/entity/offer-letter.entity";

export interface RejectOfferRequestDTO {
  offerId: string;
  candidateId: string;
  remarks?: string;
}

export interface RejectOfferResponseDTO {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
  rejectedAt: Date;
}