import {
  Currency,
  EmploymentType,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";

export interface CreateOfferRequestDTO {
  applicationId: string;
  recruiterId: string;
  annualCTC: number;
  currency: Currency;
  employmentType: EmploymentType;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  expiryDate: Date;
}

export interface CreateOfferResponseDTO {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
}
