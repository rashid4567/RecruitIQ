export interface UpdateCandidateProfileDTO {
  fullName?: string;
  profileImage?: string;
  currentJob?: string;
  experienceYears?: number;
  skills?: string[];
  educationLevel?: string;
  preferredJobLocations?: string[];
  bio?: string;
  currentJobLocation ?:string,
  gender ?:string,
  linkedinUrl?:string,
  portfolioUrl?:string,
}
