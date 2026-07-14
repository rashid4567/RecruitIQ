import {
  Currency,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";

export interface GetOfferDetailsRequestDTO {
  offerId: string;
}

export interface GetOfferDetailsResponseDTO {
  id: string;
  offerNumber: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: Currency;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  offerLetterUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  sentAt?: Date;
  viewedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  candidateRemarks?: string;
}
