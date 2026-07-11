export interface CandidateOffer {
  id: string;
  offerNumber: string;
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
 viewedAt?: string;
}

export type GetCandidateOfferResponse =
  CandidateOffer;

export interface AcceptOfferRequest {
  remarks?: string;
}

export interface AcceptOfferResponse {
  offerId: string;
  offerNumber: string;
  status: string;
  acceptedAt: string;
}

export interface RejectOfferRequest {
  remarks?: string;
}

export interface RejectOfferResponse {
  offerId: string;
  offerNumber: string;
  status: string;
  rejectedAt: string;
}