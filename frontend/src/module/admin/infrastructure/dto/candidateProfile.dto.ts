export interface CandidateProfileApiDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;

  currentJob?: string;
  experienceYears?: number;
  skills?: string[];
  bio?: string;
  currentJobLocation?: string;
  profileCompleted?: boolean;

  createdAt?: string;
}
