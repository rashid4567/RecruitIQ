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

export interface CandidateOffer {
  id: string;
  offerNumber: string;
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
  viewedAt?: string;
}

export type GetCandidateOfferResponse = CandidateOffer;

export interface AcceptOfferRequest {
  remarks?: string;
}

export interface AcceptOfferResponse {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
  acceptedAt: string;
}

export interface RejectOfferRequest {
  remarks?: string;
}

export interface RejectOfferResponse {
  offerId: string;
  offerNumber: string;
  status: OfferStatus;
  rejectedAt: string;
}