import {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";

import { OfferStatus } from "../../../offer-letter/domain/entity/offer-letter.entity";

export interface GetRecruiterApplicationDetailsRequestDTO {
  applicationId: string;
  recruiterId: string;
}

export interface RecruiterApplicationDetailsResponseDTO {
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
  appliedAt: Date;
  updatedAt: Date;
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
    joiningDate: Date;
    probationPeriod?: string;
    benefits: string[];
    notes?: string;
    expiryDate: Date;
    offerLetterUrl?: string;
    offerDate: Date;
    viewedAt?: Date;
    acceptedAt?: Date;
    rejectedAt?: Date;
    sentAt?: Date;
    candidateRemarks?: string;
  };
}
