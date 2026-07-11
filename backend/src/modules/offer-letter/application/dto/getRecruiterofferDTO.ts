import {
  Currency,
  EmploymentType,
  OfferStatus,
} from "../../domain/entity/offer-letter.entity";

export interface GetRecruiterOffersRequestDTO {
  recruiterId: string;
}

export interface GetRecruiterOffersResponseDTO {
  id: string;
  offerNumber: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: Currency;
  employmentType: EmploymentType;
  workLocation: string;
  joiningDate: Date;
  offerDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  sentAt?: Date;
  viewedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
