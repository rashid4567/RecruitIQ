
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


export interface InterviewInfo {
  scheduledAt: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
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
      appliedAt: this.appliedAt,
      updatedAt: this.updatedAt,
    };
  }
}
