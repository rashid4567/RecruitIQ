export interface CreateOfferRequest {
  applicationId: string;
  annualCTC: number;
  currency: string;
  employmentType: string;
  department?: string;
  workLocation: string;
  joiningDate: string;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  expiryDate: string;
}

export interface CreateOfferResponse {
  offerId: string;
  offerNumber: string;
  status: string;
}

export interface RecruiterOffer {
  id: string;
  offerNumber: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: string;
  status: string;
  offerDate: string;
  expiryDate: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
}

export type GetRecruiterOffersResponse =
  RecruiterOffer;

export interface GetOfferDetailsResponse {
  id: string;
  offerNumber: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: string;
  employmentType: string;
  department?: string;
  workLocation: string;
  joiningDate: string;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: string;
  expiryDate: string;
  status: string;
  offerLetterUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  candidateRemarks?: string;
}