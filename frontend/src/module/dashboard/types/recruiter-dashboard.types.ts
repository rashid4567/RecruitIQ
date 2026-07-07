export interface RecruiterDashboardResponse {
  recruiter: RecruiterSummary;
  jobs: DashboardJob[];
  applications: DashboardApplication[];
  interviews: DashboardInterview[];
  subscription: DashboardSubscription | null;
  notifications: DashboardNotification[];
}

export interface RecruiterSummary {
  recruiterId: string;
  recruiterName: string;
  companyName?: string;
  profileImage?: string;
}

export interface DashboardJob {
  id?: string;
  title: string;
  status: string;
  views: number;
  applicationsCount: number;
  publicationCount: number;
  createdAt: string;
}

export interface DashboardApplication {
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
  appliedAt: string;
}

export interface DashboardInterview {
  interviewId: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateProfileImage?: string;
  jobId: string;
  jobTitle: string;
  round: number;
  status: string;
  scheduledAt: string;
  roomId?: string;
}

export interface DashboardSubscription {
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  jobPostsUsed: number;
  jobPostsLimit: number;
  screeningUsed: number;
  screeningLimit: number;
  aiScoreUsed: number;
  aiScoreLimit: number;
  resumeDownloadedCount: number;
  resumeDownloadLimit: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
