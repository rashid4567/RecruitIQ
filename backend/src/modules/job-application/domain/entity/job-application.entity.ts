import { DomainError } from "../../../../shared/errors/domain.error";
import { APPLICATION_ERRORS } from "../error/Application.error";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface InterviewInfo {
  scheduledAt: Date;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export enum ApplicationRecommendation {
  STRONG_MATCH = "STRONG_MATCH",
  GOOD_MATCH = "GOOD_MATCH",
  PARTIAL_MATCH = "PARTIAL_MATCH",
  POOR_MATCH = "POOR_MATCH",
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
  analyzedAt: Date;
 
}

export interface JobApplicationProps {
  id?: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: Date;
  updatedAt: Date;
}

export class JobApplication {
  private constructor(private props: JobApplicationProps) {
    this.validate();
  }

  static apply(
    props: Omit<
      JobApplicationProps,
      | "id"
      | "status"
      | "interview"
      | "rejectionReason"
      | "aiAnalysis"
      | "appliedAt"
      | "updatedAt"
    >,
  ): JobApplication {
    return new JobApplication({
      ...props,
      status: ApplicationStatus.APPLIED,
      interview: undefined,
      rejectionReason: undefined,
      aiAnalysis: undefined,
      appliedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: JobApplicationProps): JobApplication {
    return new JobApplication(props);
  }

  private validate(): void {
    if (!this.props.jobId?.trim()) {
      throw new DomainError(APPLICATION_ERRORS.JOB_REQUIRED);
    }

    if (!this.props.candidateId?.trim()) {
      throw new DomainError(APPLICATION_ERRORS.CANDIDATE_REQUIRED);
    }

    if (!this.props.recruiterId?.trim()) {
      throw new DomainError(APPLICATION_ERRORS.RECRUITER_REQUIRED);
    }

    if (!this.props.resumeId?.trim()) {
      throw new DomainError(APPLICATION_ERRORS.RESUME_REQUIRED);
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private ensureMutable(): void {
    if (this.props.status === ApplicationStatus.WITHDRAWN) {
      throw new DomainError(APPLICATION_ERRORS.APPLICATION_WITHDRAWN);
    }

    if (this.props.status === ApplicationStatus.SELECTED) {
      throw new DomainError(APPLICATION_ERRORS.CANDIDATE_SELECTED);
    }

    if (this.props.status === ApplicationStatus.REJECTED) {
      throw new DomainError(APPLICATION_ERRORS.CANDIDATE_REJECTED);
    }
  }

  shortlist(): void {
    if (this.props.status !== ApplicationStatus.APPLIED) {
      throw new DomainError(APPLICATION_ERRORS.INVALID_APPLICATION_STATUS);
    }

    this.props.status = ApplicationStatus.SHORTLISTED;
    this.props.rejectionReason = undefined;

    this.touch();
  }

  updateAIAnalysis(analysis: ApplicationAIAnalysis): void {
    this.props.aiAnalysis = analysis;
    this.touch();
  }

  reject(reason: string): void {
    this.ensureMutable();

    if (!reason?.trim()) {
      throw new DomainError(APPLICATION_ERRORS.REJECTION_REASON_REQUIRED);
    }

    this.props.status = ApplicationStatus.REJECTED;
    this.props.rejectionReason = reason.trim();
    this.props.interview = undefined;

    this.touch();
  }

  scheduleInterview(interview: InterviewInfo): void {
    this.ensureMutable();

    if (
      this.props.status !== ApplicationStatus.APPLIED &&
      this.props.status !== ApplicationStatus.SHORTLISTED
    ) {
      throw new DomainError(APPLICATION_ERRORS.INVALID_APPLICATION_STATUS);
    }

    if (interview.scheduledAt < new Date()) {
      throw new DomainError(APPLICATION_ERRORS.INVALID_INTERVIEW_DATE);
    }

    const location = interview.location?.trim();
    const meetingLink = interview.meetingLink?.trim();

    if (!location && !meetingLink) {
      throw new DomainError(APPLICATION_ERRORS.INTERVIEW_LOCATION_REQUIRED);
    }

    this.props.status = ApplicationStatus.INTERVIEW_SCHEDULED;
    this.props.interview = {
      ...interview,
      location,
      meetingLink,
    };

    this.touch();
  }

  rescheduleInterview(interview: InterviewInfo): void {
    if (
      this.props.status !== ApplicationStatus.INTERVIEW_SCHEDULED ||
      !this.props.interview
    ) {
      throw new DomainError(APPLICATION_ERRORS.INTERVIEW_NOT_FOUND);
    }

    if (interview.scheduledAt < new Date()) {
      throw new DomainError(APPLICATION_ERRORS.INVALID_INTERVIEW_DATE);
    }

    this.props.interview = interview;

    this.touch();
  }

  select(): void {
    if (this.props.status !== ApplicationStatus.INTERVIEW_SCHEDULED) {
      throw new DomainError(
        APPLICATION_ERRORS.INTERVIEW_REQUIRED_BEFORE_SELECTION,
      );
    }

    this.props.status = ApplicationStatus.SELECTED;

    this.touch();
  }

  withdraw(): void {
    if (
      this.props.status === ApplicationStatus.SELECTED ||
      this.props.status === ApplicationStatus.REJECTED ||
      this.props.status === ApplicationStatus.WITHDRAWN
    ) {
      throw new DomainError(APPLICATION_ERRORS.CANNOT_WITHDRAW);
    }

    this.props.status = ApplicationStatus.WITHDRAWN;

    this.touch();
  }

  canCandidateWithdraw(): boolean {
    return (
      this.props.status !== ApplicationStatus.SELECTED &&
      this.props.status !== ApplicationStatus.REJECTED &&
      this.props.status !== ApplicationStatus.WITHDRAWN
    );
  }

  canRecruiterShortlist(): boolean {
    return this.props.status === ApplicationStatus.APPLIED;
  }

  canScheduleInterview(): boolean {
    return (
      this.props.status === ApplicationStatus.APPLIED ||
      this.props.status === ApplicationStatus.SHORTLISTED
    );
  }

  canSelect(): boolean {
    return this.props.status === ApplicationStatus.INTERVIEW_SCHEDULED;
  }

  canReject(): boolean {
    return (
      this.props.status !== ApplicationStatus.REJECTED &&
      this.props.status !== ApplicationStatus.SELECTED &&
      this.props.status !== ApplicationStatus.WITHDRAWN
    );
  }

  canRescheduleInterview(): boolean {
    return this.props.status === ApplicationStatus.INTERVIEW_SCHEDULED;
  }

  isPending(): boolean {
    return this.props.status === ApplicationStatus.APPLIED;
  }

  isInterviewScheduled(): boolean {
    return this.props.status === ApplicationStatus.INTERVIEW_SCHEDULED;
  }

  isRejected(): boolean {
    return this.props.status === ApplicationStatus.REJECTED;
  }

  isSelected(): boolean {
    return this.props.status === ApplicationStatus.SELECTED;
  }

  isWithdrawn(): boolean {
    return this.props.status === ApplicationStatus.WITHDRAWN;
  }

  belongsToCandidate(candidateId: string): boolean {
    return this.props.candidateId === candidateId;
  }

  belongsToRecruiter(recruiterId: string): boolean {
    return this.props.recruiterId === recruiterId;
  }

  toObject(): JobApplicationProps {
    return { ...this.props };
  }

  get id() {
    return this.props.id;
  }

  get jobId() {
    return this.props.jobId;
  }

  get candidateId() {
    return this.props.candidateId;
  }

  get recruiterId() {
    return this.props.recruiterId;
  }

  get resumeId() {
    return this.props.resumeId;
  }

  get coverLetter() {
    return this.props.coverLetter;
  }

  get status() {
    return this.props.status;
  }

  get interview() {
    return this.props.interview;
  }

  get rejectionReason() {
    return this.props.rejectionReason;
  }

  get appliedAt() {
    return this.props.appliedAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get aiAnalysis() {
    return this.props.aiAnalysis;
  }
  get aiScore(): number | undefined {
    return this.props.aiAnalysis?.overallScore;
  }
  get aiRecommendation(): ApplicationRecommendation | undefined {
    return this.props.aiAnalysis?.recommendation;
  }
}
