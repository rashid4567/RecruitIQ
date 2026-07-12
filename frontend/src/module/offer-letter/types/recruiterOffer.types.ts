export const OfferStatus = {
  SENT: "SENT",
  VIEWED: "VIEWED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;

export type OfferStatus =
  (typeof OfferStatus)[keyof typeof OfferStatus];

export interface CreateOfferRequest {
  applicationId: string;
  annualCTC: number;
  currency: string;
  department?: string;
  workLocation: string;
  joiningDate: string;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;

  contactEmail?: string;
  contactPhone?: string;

  expiryDate: string;
}

export interface CreateOfferResponse {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
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
  status: OfferStatus;

  contactEmail?: string;
  contactPhone?: string;

  offerDate: string;
  expiryDate: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
}

export type GetRecruiterOffersResponse = RecruiterOffer;

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
  department?: string;
  workLocation: string;
  joiningDate: string;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  contactEmail?: string;
  contactPhone?: string;
  offerDate: string;
  expiryDate: string;
  status: OfferStatus;
  offerLetterUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  candidateRemarks?: string;
}