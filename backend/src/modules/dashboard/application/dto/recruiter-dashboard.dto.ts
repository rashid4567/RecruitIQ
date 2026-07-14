export interface RecruiterDashboardRequestDTO {
  recruiterId: string;
}

export interface RecruiterDashboardDTO {
  recruiter: RecruiterSummaryDTO;
  jobs: RecruiterDashboardJobDTO[];
  applications: RecruiterDashboardApplicationDTO[];
  interviews: RecruiterDashboardInterviewDTO[];
  subscription: RecruiterDashboardSubscriptionDTO | null;
  notifications: RecruiterDashboardNotificationDTO[];
}

export interface RecruiterSummaryDTO {
  recruiterId: string;
  recruiterName: string;
  companyName?: string;
  profileImage?: string;
}

export interface RecruiterDashboardJobDTO {
  id?: string;
  title: string;
  status: string;
  views: number;
  applicationsCount: number;
  publicationCount: number;
  createdAt: Date;
}

export interface RecruiterDashboardApplicationDTO {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: string;
  analysisStatus: string;
  aiScore?: number;
  recommendation?: string;
  appliedAt: Date;
}

export interface RecruiterDashboardInterviewDTO {
  interviewId: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateProfileImage?: string;
  jobId: string;
  jobTitle: string;
  round: number;
  status: string;
  scheduledAt: Date;
  roomId?: string;
}

export interface RecruiterDashboardSubscriptionDTO {
  planName: string;
  status: string;
  startDate: Date;
  endDate: Date;
  jobPostsUsed: number;
  jobPostsLimit: number;
  screeningUsed: number;
  screeningLimit: number;
  aiScoreUsed: number;
  aiScoreLimit: number;
  resumeDownloadedCount: number;
}

export interface RecruiterDashboardNotificationDTO {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}
