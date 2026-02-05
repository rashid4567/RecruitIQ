export interface RecruiterProfileDTO {
  companyName?: string;
  companyWebsite?: string;
  companySize?: number;
  industry?: string;
  designation?: string;
  location?: string;
  bio?: string;
  linkedinUrl   ?:string,
  subscriptionStatus?: string;
  jobPostsUsed?: number;
  verificationStatus?: string;
}


export interface UserProfileDTO{
    id : string,
    fullName?:string,
    email?:string,
    profileImage?:string,
}

export interface RecruiterProfileReponse {
  user: UserProfileDTO;
  recruiter: RecruiterProfileDTO;
}
