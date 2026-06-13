export const ApplicationStatus = {
  APPLIED: "APPLIED",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  SELECTED: "SELECTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ApplicationRecommendation = {
  STRONG_MATCH: "STRONG_MATCH",
  GOOD_MATCH: "GOOD_MATCH",
  PARTIAL_MATCH: "PARTIAL_MATCH",
  POOR_MATCH: "POOR_MATCH",
} as const;

export type ApplicationRecommendation =
  (typeof ApplicationRecommendation)[keyof typeof ApplicationRecommendation];

export interface InterviewInfo {
  scheduledAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface ApplicationAIAnalysis {
  overallScore: number;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  recommendation: ApplicationRecommendation;
  summary: string;
  analyzedAt: string;
}

export class JobApplication {
  private readonly id: string;
  private readonly jobId: string;
  private readonly candidateId: string;
  private readonly recruiterId: string;
  private readonly resumeId: string;
  private readonly coverLetter?: string;
  private readonly status: ApplicationStatus;
  private readonly interview?: InterviewInfo;
  private readonly rejectionReason?: string;
  private readonly aiAnalysis?: ApplicationAIAnalysis;
  private readonly appliedAt: string;
  private readonly updatedAt: string;

  private constructor(
    id: string,
    jobId: string,
    candidateId: string,
    recruiterId: string,
    resumeId: string,
    status: ApplicationStatus,
    appliedAt: string,
    updatedAt: string,
    coverLetter?: string,
    interview?: InterviewInfo,
    rejectionReason?: string,
    aiAnalysis?: ApplicationAIAnalysis,
  ) {
    this.id = id;
    this.jobId = jobId;
    this.candidateId = candidateId;
    this.recruiterId = recruiterId;
    this.resumeId = resumeId;
    this.coverLetter = coverLetter;
    this.status = status;
    this.interview = interview;
    this.rejectionReason = rejectionReason;
    this.aiAnalysis = aiAnalysis;
    this.appliedAt = appliedAt;
    this.updatedAt = updatedAt;
  }

  static create(props: {
    id: string;
    jobId: string;
    candidateId: string;
    recruiterId: string;
    resumeId: string;
    status: ApplicationStatus;
    appliedAt: string;
    updatedAt: string;
    coverLetter?: string;
    interview?: InterviewInfo;
    rejectionReason?: string;
    aiAnalysis?: ApplicationAIAnalysis;
  }): JobApplication {
    return new JobApplication(
      props.id,
      props.jobId,
      props.candidateId,
      props.recruiterId,
      props.resumeId,
      props.status,
      props.appliedAt,
      props.updatedAt,
      props.coverLetter,
      props.interview,
      props.rejectionReason,
      props.aiAnalysis,
    );
  }

  getId(): string {
    return this.id;
  }

  getJobId(): string {
    return this.jobId;
  }

  getCandidateId(): string {
    return this.candidateId;
  }

  getRecruiterId(): string {
    return this.recruiterId;
  }

  getResumeId(): string {
    return this.resumeId;
  }

  getCoverLetter(): string | undefined {
    return this.coverLetter;
  }

  getStatus(): ApplicationStatus {
    return this.status;
  }

  getInterview(): InterviewInfo | undefined {
    return this.interview;
  }

  getRejectionReason(): string | undefined {
    return this.rejectionReason;
  }

  getAIAnalysis(): ApplicationAIAnalysis | undefined {
    return this.aiAnalysis;
  }

  getAIScore(): number | undefined {
    return this.aiAnalysis?.overallScore;
  }

  getAIRecommendation(): ApplicationRecommendation | undefined {
    return this.aiAnalysis?.recommendation;
  }

  getAppliedAt(): string {
    return this.appliedAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  isApplied(): boolean {
    return this.status === ApplicationStatus.APPLIED;
  }

  isShortlisted(): boolean {
    return this.status === ApplicationStatus.SHORTLISTED;
  }

  isInterviewScheduled(): boolean {
    return this.status === ApplicationStatus.INTERVIEW_SCHEDULED;
  }

  isSelected(): boolean {
    return this.status === ApplicationStatus.SELECTED;
  }

  isRejected(): boolean {
    return this.status === ApplicationStatus.REJECTED;
  }

  isWithdrawn(): boolean {
    return this.status === ApplicationStatus.WITHDRAWN;
  }

  toJSON() {
    return {
      id: this.id,
      jobId: this.jobId,
      candidateId: this.candidateId,
      recruiterId: this.recruiterId,
      resumeId: this.resumeId,
      coverLetter: this.coverLetter,
      status: this.status,
      interview: this.interview,
      rejectionReason: this.rejectionReason,
      aiAnalysis: this.aiAnalysis,
      appliedAt: this.appliedAt,
      updatedAt: this.updatedAt,
    };
  }
}
 