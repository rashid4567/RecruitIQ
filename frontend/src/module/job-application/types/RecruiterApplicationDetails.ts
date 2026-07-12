import type {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationStatus,
  InterviewInfo,
} from "../types/jobApplication.types";

import type { OfferStatus } from "@/module/offer-letter/types/candidateOffer.types";

export interface RecruiterApplicationDetails {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateProfileImage?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: string;
  updatedAt: string;
  offer?: {
    id: string;
    offerNumber: string;
    status: OfferStatus;
    companyName: string;
    jobTitle: string;
    department?: string;
    workLocation: string;
    annualCTC: number;
    currency: string;
    joiningDate: string;
    probationPeriod?: string;
    benefits: string[];
    notes?: string;
    offerDate: string;
    expiryDate: string;
    offerLetterUrl?: string;
    sentAt?: string;
    viewedAt?: string;
    acceptedAt?: string;
    rejectedAt?: string;
    candidateRemarks?: string;
  };
}
