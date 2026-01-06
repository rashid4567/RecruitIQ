export interface UpdateCandidateProfilePayload {
  currentJob?: string;
  experienceYears?: number;
  educationLevel?: string;
  skills?: string[];
  preferredJobLocation?: string[];
  linkedinUrl?: string;
  profileCompleted?: boolean;
}
