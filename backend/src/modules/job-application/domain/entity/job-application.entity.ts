import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export const ApplicationAnalysisStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
} as const;

export type ApplicationAnalysisStatus =
  (typeof ApplicationAnalysisStatus)[keyof typeof ApplicationAnalysisStatus];

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
  analysisStatus: ApplicationAnalysisStatus;
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
      | "analysisStatus"
      | "aiAnalysis"
      | "appliedAt"
      | "updatedAt"
    >,
  ): JobApplication {
    return new JobApplication({
      ...props,
      status: ApplicationStatus.APPLIED,
      analysisStatus: ApplicationAnalysisStatus.PENDING,
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
      throw new DomainError(DOMAIN_ERROR_CODES.JOB_REQUIRED);
    }
    if (!this.props.candidateId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.CANDIDATE_REQUIRED);
    }
    if (!this.props.recruiterId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECRUITER_REQUIRED);
    }
    if (!this.props.resumeId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RESUME_REQUIRED);
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private ensureMutable(): void {
    if (this.props.status === ApplicationStatus.WITHDRAWN) {
      throw new DomainError(DOMAIN_ERROR_CODES.APPLICATION_WITHDRAWN);
    }
    if (this.props.status === ApplicationStatus.SELECTED) {
      throw new DomainError(DOMAIN_ERROR_CODES.CANDIDATE_SELECTED);
    }
    if (this.props.status === ApplicationStatus.REJECTED) {
      throw new DomainError(DOMAIN_ERROR_CODES.CANDIDATE_REJECTED);
    }
  }

  shortlist(): void {
    if (this.props.status !== ApplicationStatus.APPLIED) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_APPLICATION_STATUS);
    }
    this.props.status = ApplicationStatus.SHORTLISTED;
    this.props.rejectionReason = undefined;
    this.touch();
  }

  updateAIAnalysis(analysis: ApplicationAIAnalysis): void {
    if (this.props.aiAnalysis) {
      throw new DomainError(DOMAIN_ERROR_CODES.ANALYSIS_ALREADY_EXISTS);
    }

    if (this.props.analysisStatus !== ApplicationAnalysisStatus.PROCESSING) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_ANALYSIS_STATUS);
    }
    this.validateAIAnalysis(analysis);
    this.props.aiAnalysis = analysis;
    this.props.analysisStatus = ApplicationAnalysisStatus.COMPLETED;
    this.touch();
  }

  private validateAIAnalysis(analysis: ApplicationAIAnalysis): void {
    const scores = [
      analysis.overallScore,
      analysis.requiredSkillsScore,
      analysis.preferredSkillsScore,
      analysis.experienceScore,
      analysis.requirementsScore,
      analysis.educationScore,
    ];
    const hasInvalidScore = scores.some((score) => score < 0 || score > 100);
    if (hasInvalidScore) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_ANALYSIS_SCORE);
    }
  }

  markAnalysisFailed(): void {
    if (this.props.analysisStatus === ApplicationAnalysisStatus.COMPLETED) {
      return;
    }
    this.props.analysisStatus = ApplicationAnalysisStatus.FAILED;
    this.touch();
  }

  markAnalysisProcessing(): void {
    if (
      this.props.analysisStatus !== ApplicationAnalysisStatus.PENDING &&
      this.props.analysisStatus !== ApplicationAnalysisStatus.QUOTA_EXCEEDED &&
      this.props.analysisStatus !== ApplicationAnalysisStatus.FAILED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_ANALYSIS_STATUS);
    }

    this.props.analysisStatus = ApplicationAnalysisStatus.PROCESSING;
    this.touch();
  }

  markAnalysisPending(): void {
    if (this.props.analysisStatus === ApplicationAnalysisStatus.COMPLETED) {
      return;
    }
    this.props.analysisStatus = ApplicationAnalysisStatus.PENDING;
    this.touch();
  }

  markAnalysisQuotaExceeded(): void {
    if (this.props.analysisStatus === ApplicationAnalysisStatus.COMPLETED) {
      return;
    }
    this.props.analysisStatus = ApplicationAnalysisStatus.QUOTA_EXCEEDED;
    this.touch();
  }

  reject(reason?: string): void {
    this.ensureMutable();
    this.props.status = ApplicationStatus.REJECTED;
    this.props.rejectionReason = reason?.trim() || undefined;
    this.props.interview = undefined;
    this.touch();
  }



 selectInterview(): void {
  this.ensureMutable();

  if (
    this.props.status !== ApplicationStatus.APPLIED &&
    this.props.status !== ApplicationStatus.SHORTLISTED
  ) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_SCHEDULED_FOR_CURRENT_APPLICATION_STATUS,
    );
  }

  this.props.status = ApplicationStatus.INTERVIEW_SCHEDULED;
  this.touch();
}

  select(): void {
    if (this.props.status !== ApplicationStatus.INTERVIEW_SCHEDULED) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.INTERVIEW_REQUIRED_BEFORE_SELECTION,
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
      throw new DomainError(DOMAIN_ERROR_CODES.CANNOT_WITHDRAW);
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

  
  markInterviewScheduled():void{
     if(this.props.status !== ApplicationStatus.APPLIED && this.props.status !== ApplicationStatus.SHORTLISTED){
      throw new DomainError(ERROR_CODES.INTERVIEW_CANNOT_BE_SCHEDULED_FOR_CURRENT_APPLICATION_STATUS)
     }
     this.props.status = ApplicationStatus.INTERVIEW_SCHEDULED;
     this.touch();
  }

  markInterviewCancelled(): void {
  if (this.props.status !== ApplicationStatus.INTERVIEW_SCHEDULED) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.INTERVIEW_NOT_SCHEDULED,
    );
  }

  this.props.status = ApplicationStatus.SHORTLISTED;

  this.touch();
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

  isAnalysisPending(): boolean {
    return this.props.analysisStatus === ApplicationAnalysisStatus.PENDING;
  }

  isAnalysisProcessing(): boolean {
    return this.props.analysisStatus === ApplicationAnalysisStatus.PROCESSING;
  }

  isAnalysisCompleted(): boolean {
    return this.props.analysisStatus === ApplicationAnalysisStatus.COMPLETED;
  }

  isAnalysisQuotaExceeded(): boolean {
    return (
      this.props.analysisStatus === ApplicationAnalysisStatus.QUOTA_EXCEEDED
    );
  }

  isAnalysisFailed(): boolean {
    return this.props.analysisStatus === ApplicationAnalysisStatus.FAILED;
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

  get id(): string {
    if (!this.props.id) {
      throw new DomainError(ERROR_CODES.APPLICATION_ID_IS_MISSING);
    }
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

  get analysisStatus(): ApplicationAnalysisStatus {
    return this.props.analysisStatus;
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
