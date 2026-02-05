export type CandidateStatus = "Active" | "Blocked";

export interface AdminCandidateListItem {
  userId: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  applications: number;
  status: CandidateStatus;
  registeredDate: Date;
}
