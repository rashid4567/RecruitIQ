import { DomainError } from "../errors/domain.error";
import { JOB_ERRORS } from "../errors/job.error.codes";

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface InterviewInfo {
  scheduledAt: Date;
  location?: string;
  meetingLink?: string;
  notes?: string;
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
      | "appliedAt"
      | "updatedAt"
    >,
  ): JobApplication {
    return new JobApplication({
      ...props,
      status: "APPLIED",
      interview: undefined,
      rejectionReason: undefined,
      appliedAt: new Date(),
      updatedAt: new Date(),
    });
  }
  static rehydrate(props: JobApplicationProps): JobApplication {
    return new JobApplication(props);
  }
  private validate(): void {
    if (!this.props.jobId.trim()) {
      throw new DomainError(JOB_ERRORS.JOB_REQUIRED);
    }
    if (!this.props.candidateId.trim()) {
      throw new DomainError(JOB_ERRORS.CANDIDATE_REQUIRED);
    }
    if (!this.props.recruiterId.trim()) {
      throw new DomainError(JOB_ERRORS.RECRUITER_REQUIRED);
    }
    if (!this.props.resumeId.trim()) {
      throw new DomainError(JOB_ERRORS.RESUME_REQUIRED);
    }
  }
  private touch(): void {
    this.props.updatedAt = new Date();
  }
  private ensureMutable(): void {
    if (this.props.status === "WITHDRAWN") {
      throw new DomainError(JOB_ERRORS.APPLICATION_WITHDRAWN);
    }
    if (this.props.status === "SELECTED") {
      throw new DomainError(JOB_ERRORS.CANDIDATE_SELECTED);
    }
    if (this.props.status === "REJECTED") {
      throw new DomainError(JOB_ERRORS.CANDIDATE_REJECTED);
    }
  }
  shortlist(): void {
    this.ensureMutable();
    this.props.status = "SHORTLISTED";
    this.touch();
  }
  reject(reason: string): void {
    this.ensureMutable();
    if (!reason.trim()) {
      throw new DomainError(JOB_ERRORS.REJECTION_REASON_REQUIRED);
    }
    this.props.status = "REJECTED";
    this.props.rejectionReason = reason;
    this.touch();
  }
  select(): void {
    this.ensureMutable();
    this.props.status = "SELECTED";
    this.touch();
  }
  withdraw(): void {
    if (this.props.status === "SELECTED") {
      throw new DomainError(JOB_ERRORS.CANNOT_WITHDRAW);
    }
    this.props.status = "WITHDRAWN";
    this.touch();
  }
  scheduleInterview(interview: InterviewInfo): void {
    this.ensureMutable();
    if (interview.scheduledAt < new Date()) {
      throw new DomainError(JOB_ERRORS.INVALID_INTERVIEW_DATE);
    }
    this.props.status = "INTERVIEW_SCHEDULED";
    this.props.interview = interview;
    this.touch();
  }
  rescheduleInterview(interview: InterviewInfo): void {
    if (this.props.status !== "INTERVIEW_SCHEDULED") {
      throw new DomainError(JOB_ERRORS.INTERVIEW_NOT_FOUND);
    }
    this.props.interview = interview;
    this.touch();
  }
  canCandidateWithdraw() {
    return (
      this.props.status !== "SELECTED" && this.props.status !== "WITHDRAWN"
    );
  }
  canRecruiterShortlist() {
    return this.props.status === "APPLIED";
  }
  canScheduleInterview() {
    return (
      this.props.status === "APPLIED" || this.props.status === "SHORTLISTED"
    );
  }
  isPending() {
    return this.props.status === "APPLIED";
  }
  isRejected() {
    return this.props.status === "REJECTED";
  }
  isSelected() {
    return this.props.status === "SELECTED";
  }
  isWithdrawn() {
    return this.props.status === "WITHDRAWN";
  }
  belongsToCandidate(candidateId: string) {
    return this.props.candidateId === candidateId;
  }
  belongsToRecruiter(recruiterId: string) {
    return this.props.recruiterId === recruiterId;
  }
  toObject(): JobApplicationProps {
    return {
      ...this.props,
    };
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
  get status() {
    return this.props.status;
  }
  get interview() {
    return this.props.interview;
  }
  get appliedAt() {
    return this.props.appliedAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
