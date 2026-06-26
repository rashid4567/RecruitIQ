import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
export interface JobMeta {
  id: string;
  title: string;
  applications: number;
  postedDate: string;
}

export interface ApplicationRow {
  id: string;
  candidateId: string;
  name: string;
  initials: string;
  email: string;
  profileImage?: string;
  applicationDate: string;
  appliedAtRaw: Date | string;
  aiScore: number;
  matchPercent: number;
  status: ApplicationStatus;
  scoreBarColor: string;
}

export type SortOption =
  | "Application Date"
  | "Match Score"
  | "AI Score"
  | "Name";
