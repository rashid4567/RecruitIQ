import {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationStatus,
} from "../../domain/entity/job-application.entity";

import { OfferStatus } from "../../../offer-letter/domain/entity/offer-letter.entity";
import { InterviewStatus } from "../../../interview/domain/entity/interview.entity";
import { ParsedResumeData } from "../../../resume/domain/entity/resume.entity";

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
  appliedResumeFileName: string;
  appliedResumeFileKey: string;
  appliedResumeData: ParsedResumeData;
  candidateName?: string;
  candidateEmail?: string;
  candidateProfileImage?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: Date;
  updatedAt: Date;
  interview?: {
    id: string;
    scheduledAt: Date;
    status: InterviewStatus;
    completed: boolean;
  };
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