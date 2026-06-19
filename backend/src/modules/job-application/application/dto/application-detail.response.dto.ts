import { ApplicationStatus } from "../../domain/entity/job-application.entity";

export interface ApplicationDetailResponseDTO {
  application: {
    id?: string;
    jobId: string;
    candidateId: string;
    recruiterId: string;
    resumeId: string;
    status: ApplicationStatus;
    appliedAt: Date;
    updatedAt: Date;
    coverLetter?: string;
    rejectionReason?: string;
    interview?: {
      scheduledAt: Date;
      location?: string;
      meetingLink?: string;
      notes?: string;
    };
  };

  job: {
    id?: string;
    companyName: string;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    experienceMin: number;
    experienceMax: number;
    location: {
      city: string;
      state: string;
      country: string;
    };
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    department: string;
    jobType: string;
    isRemote: boolean;
    positions: number;
    postedOn?: Date;
    expiresAt?: Date;
  };
}

export interface GetApplicationDetailRequestDTO {
   candidateId: string,
    applicationId: string,
}