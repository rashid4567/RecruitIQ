export interface UpdateCandidateProfileDTO {
  fullName?: string;
  email?: string;
  profileImage?: string;
  currentJob?: string;
  experienceYears?: number;
  skills?: string[];
  educationLevel?: string;
  preferredJobLocation?: string[];
  bio?: string;
}
