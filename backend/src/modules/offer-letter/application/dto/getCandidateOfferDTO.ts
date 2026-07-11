import {
  Currency,
  EmploymentType,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";

export interface GetCandidateOfferRequestDTO {
  offerId: string;
  candidateId: string;
}

export interface GetCandidateOfferResponseDTO {
  id: string;
  offerNumber: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: Currency;
  employmentType: EmploymentType;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  viewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
