export interface ParsedResumeData {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  totalExperienceYears?: number | null;
}

export const ResumeParseStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type ResumeParseStatus =
  (typeof ResumeParseStatus)[keyof typeof ResumeParseStatus];

export interface Resume {
  id: string;
  candidateId: string;
  fileName: string;
  fileKey: string;
  uploadedAt: string;
  parseStatus: ResumeParseStatus;
  parsedData?: ParsedResumeData;
}