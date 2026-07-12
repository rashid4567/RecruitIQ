import {
  Currency,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";

export interface CreateOfferRequestDTO {
  applicationId: string;
  recruiterId: string;
  annualCTC: number;
  currency: Currency;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  contactEmail?: string;
  contactPhone?: string;
  expiryDate: Date;
}

export interface CreateOfferResponseDTO {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
}
