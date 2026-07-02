import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";
import { DomainError } from "../../../../shared/errors/domain.error";

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum InterviewMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum CandidateResponseStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface InterviewProps {
  id?: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  roomId?: string;
  round: number;
  title: string;
  description?: string;
  mode: InterviewMode;
  status: InterviewStatus;
  scheduledAt: Date;
  durationInMinutes: number;
  location?: string;
  meetingLink?: string;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: Date;
  candidateResponseMessage?: string;
  rescheduleRequested: boolean;
  requestedReason?: string;
  rescheduleRequestedAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  recruiterJoinedAt?: Date;
  candidateJoinedAt?: Date;
  notes?: string;
  cancelledReason?: string;
  cancelledBy?: string;
  reminderSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Interview {
  private constructor(private props: InterviewProps) {
    this.validate();
  }

  static create(
    props: Omit<
      InterviewProps,
      | "id"
      | "status"
      | "round"
      | "reminderSent"
      | "createdAt"
      | "updatedAt"
      | "candidateResponseStatus"
      | "candidateRespondedAt"
      | "candidateResponseMessage"
      | "rescheduleRequested"
      | "requestedReason"
      | "rescheduleRequestedAt"
    > &
      Partial<
        Pick<
          InterviewProps,
          | "round"
          | "status"
          | "reminderSent"
          | "candidateResponseStatus"
          | "candidateRespondedAt"
          | "candidateResponseMessage"
          | "rescheduleRequested"
          | "requestedReason"
          | "rescheduleRequestedAt"
        >
      >,
  ): Interview {
    return new Interview({
      ...props,
      round: props.round ?? 1,
      status: props.status ?? InterviewStatus.SCHEDULED,
      reminderSent: props.reminderSent ?? false,
      candidateResponseStatus:
        props.candidateResponseStatus ?? CandidateResponseStatus.PENDING,
      rescheduleRequested: props.rescheduleRequested ?? false,
      candidateRespondedAt: props.candidateRespondedAt,
      candidateResponseMessage: props.candidateResponseMessage,
      requestedReason: props.requestedReason,
      rescheduleRequestedAt: props.rescheduleRequestedAt,
    });
  }
  private validate(): void {
    if (!this.props.applicationId.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.APPLICATION_REQUIRED);
    }

    if (!this.props.jobId.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.JOB_REQUIRED);
    }

    if (!this.props.candidateId.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.CANDIDATE_REQUIRED);
    }

    if (!this.props.recruiterId.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECRUITER_REQUIRED);
    }

    if (!this.props.title.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_TITLE_REQUIRED);
    }

    if (this.props.durationInMinutes < 15) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_DURATION_INVALID);
    }

    if (
      this.props.mode === InterviewMode.ONLINE &&
      !this.props.meetingLink?.trim()
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_MEETING_LINK_REQUIRED);
    }

    if (
      this.props.mode === InterviewMode.OFFLINE &&
      !this.props.location?.trim()
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_LOCATION_REQUIRED);
    }
  }

  static rehydrate(props: InterviewProps): Interview {
    return new Interview(props);
  }

  private ensureMutable(): void {
    if (this.props.status === InterviewStatus.CANCELLED) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ALREADY_CANCELLED);
    }

    if (this.props.status === InterviewStatus.COMPLETED) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ALREADY_COMPLETED);
    }
  }

  get id(): string {
    if (!this.props.id) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ID_REQUIRED);
    }
    return this.props.id;
  }

  get applicationId(): string {
    return this.props.applicationId;
  }

  get jobId(): string {
    return this.props.jobId;
  }

  get candidateId(): string {
    return this.props.candidateId;
  }

  get recruiterId(): string {
    return this.props.recruiterId;
  }

  get roomId(): string | undefined {
    return this.props.roomId;
  }

  get round(): number {
    return this.props.round;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get mode(): InterviewMode {
    return this.props.mode;
  }

  get status(): InterviewStatus {
    return this.props.status;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get durationInMinutes(): number {
    return this.props.durationInMinutes;
  }

  get location(): string | undefined {
    return this.props.location;
  }

  get meetingLink(): string | undefined {
    return this.props.meetingLink;
  }

  get candidateResponseStatus(): CandidateResponseStatus {
    return this.props.candidateResponseStatus;
  }

  get candidateRespondedAt(): Date | undefined {
    return this.props.candidateRespondedAt;
  }

  get candidateResponseMessage(): string | undefined {
    return this.props.candidateResponseMessage;
  }

  get rescheduleRequested(): boolean {
    return this.props.rescheduleRequested;
  }

  get requestedReason(): string | undefined {
    return this.props.requestedReason;
  }

  get rescheduleRequestedAt(): Date | undefined {
    return this.props.rescheduleRequestedAt;
  }

  get recruiterJoinedAt(): Date | undefined {
    return this.props.recruiterJoinedAt;
  }

  get candidateJoinedAt(): Date | undefined {
    return this.props.candidateJoinedAt;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get endedAt(): Date | undefined {
    return this.props.endedAt;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get cancelledReason(): string | undefined {
    return this.props.cancelledReason;
  }

  get cancelledBy(): string | undefined {
    return this.props.cancelledBy;
  }

  get reminderSent(): boolean {
    return this.props.reminderSent;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  schedule(
    scheduledAt: Date,
    durationInMinutes: number,
    meetingLink?: string,
    roomId?: string,
    location?: string,
  ): void {
    this.ensureMutable();

    if (scheduledAt <= new Date()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_INTERVIEW_DATE);
    }

    if (durationInMinutes < 15) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_DURATION_INVALID);
    }

    if (this.props.mode === InterviewMode.ONLINE && !meetingLink?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_MEETING_LINK_REQUIRED);
    }

    if (this.props.mode === InterviewMode.OFFLINE && !location?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_LOCATION_REQUIRED);
    }

    this.props.scheduledAt = scheduledAt;
    this.props.durationInMinutes = durationInMinutes;
    this.props.meetingLink = meetingLink?.trim();
    this.props.roomId = roomId?.trim();
    this.props.location = location?.trim();

    this.props.status = InterviewStatus.SCHEDULED;

    this.touch();
  }

  reschedule(
    scheduledAt: Date,
    durationInMinutes: number,
    meetingLink?: string,
    roomId?: string,
    location?: string,
  ): void {
    this.ensureMutable();

    if (
      this.props.status !== InterviewStatus.SCHEDULED &&
      this.props.status !== InterviewStatus.RESCHEDULED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_RESCHEDULED);
    }

    if (scheduledAt <= new Date()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_INTERVIEW_DATE);
    }

    if (durationInMinutes < 15) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_DURATION_INVALID);
    }

    if (this.props.mode === InterviewMode.ONLINE && !meetingLink?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_MEETING_LINK_REQUIRED);
    }

    if (this.props.mode === InterviewMode.OFFLINE && !location?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_LOCATION_REQUIRED);
    }

    this.props.scheduledAt = scheduledAt;
    this.props.durationInMinutes = durationInMinutes;
    this.props.meetingLink = meetingLink?.trim();
    this.props.roomId = roomId?.trim();
    this.props.location = location?.trim();
    this.props.status = InterviewStatus.RESCHEDULED;

    this.touch();
  }

  start(): void {
    if (
      this.props.status !== InterviewStatus.SCHEDULED &&
      this.props.status !== InterviewStatus.RESCHEDULED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_STARTED);
    }

    if (
      this.props.candidateResponseStatus !== CandidateResponseStatus.ACCEPTED
    ) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.CANDIDATE_HAS_NOT_ACCEPTED_INTERVIEW,
      );
    }

    this.props.status = InterviewStatus.ONGOING;
    this.props.startedAt = new Date();

    this.touch();
  }

  accept(): void {
    if (
      this.props.status !== InterviewStatus.SCHEDULED &&
      this.props.status !== InterviewStatus.RESCHEDULED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_ACCEPTED);
    }

    if (
      this.props.candidateResponseStatus !== CandidateResponseStatus.PENDING
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ALREADY_RESPONDED);
    }

    this.props.candidateResponseStatus = CandidateResponseStatus.ACCEPTED;

    this.props.candidateRespondedAt = new Date();

    this.touch();
  }

  reject(reason?: string): void {
    if (
      this.props.status !== InterviewStatus.SCHEDULED &&
      this.props.status !== InterviewStatus.RESCHEDULED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_REJECTED);
    }

    if (
      this.props.candidateResponseStatus !== CandidateResponseStatus.PENDING
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ALREADY_RESPONDED);
    }

    this.props.candidateResponseStatus = CandidateResponseStatus.DECLINED;

    this.props.candidateRespondedAt = new Date();

    this.props.candidateResponseMessage = reason?.trim();

    this.touch();
  }

  requestReschedule(reason: string): void {
    if (
      this.props.candidateResponseStatus === CandidateResponseStatus.DECLINED
    ) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_REQUEST_RESCHEDULE,
      );
    }

    if (this.props.rescheduleRequested) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.RESCHEDULE_REQUEST_ALREADY_PENDING,
      );
    }

    if (!reason.trim()) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.INTERVIEW_RESCHEDULE_REASON_REQUIRED,
      );
    }

    this.props.candidateResponseStatus = CandidateResponseStatus.ACCEPTED;
    this.props.candidateRespondedAt = new Date();

    this.props.rescheduleRequested = true;
    this.props.requestedReason = reason.trim();
    this.props.rescheduleRequestedAt = new Date();

    this.touch();
  }
  approveReschedule(): void {
    if (!this.canApproveReschedule()) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.NO_PENDING_RESCHEDULE_REQUEST_AVAILABLE,
      );
    }

    this.props.rescheduleRequested = false;
    this.props.requestedReason = undefined;
    this.props.rescheduleRequestedAt = undefined;

    this.props.candidateResponseStatus = CandidateResponseStatus.PENDING;

    this.props.candidateRespondedAt = undefined;
    this.props.candidateResponseMessage = undefined;

    this.touch();
  }

  rejectRescheduleRequest(): void {
    if (!this.canRejectRescheduleRequest()) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.NO_PENDING_RESCHEDULE_REQUEST_AVAILABLE,
      );
    }

    this.props.rescheduleRequested = false;
    this.props.requestedReason = undefined;
    this.props.rescheduleRequestedAt = undefined;

    this.touch();
  }
  complete(notes?: string): void {
    if (this.props.status !== InterviewStatus.ONGOING) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_COMPLETED);
    }
    if (this.props.endedAt) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_ALREADY_COMPLETED);
    }
    this.props.status = InterviewStatus.COMPLETED;
    this.props.endedAt = new Date();

    if (notes) {
      this.props.notes = notes?.trim();
    }
    this.touch();
  }

  cancel(reason: string, cancelledBy: string): void {
    this.ensureMutable();

    if (!reason.trim()) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.INTERVIEW_CANCELLATION_REASON_REQUIRED,
      );
    }

    if (!cancelledBy.trim()) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.INTERVIEW_CANCELLATION_USER_REQUIRED,
      );
    }

    this.props.status = InterviewStatus.CANCELLED;
    this.props.cancelledReason = reason.trim();
    this.props.cancelledBy = cancelledBy;

    this.touch();
  }
  markCandidateJoined(): void {
    if (!this.canJoin()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_JOINED);
    }

    if (!this.props.candidateJoinedAt) {
      this.props.candidateJoinedAt = new Date();
    }

    this.touch();
  }
  markRecruiterJoined(): void {
    if (!this.canJoin()) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_BE_JOINED);
    }

    if (!this.props.recruiterJoinedAt) {
      this.props.recruiterJoinedAt = new Date();
    }
    this.touch();
  }

  markReminderSent(): void {
    if (this.props.reminderSent) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_REMINDER_ALREADY_SENT);
    }

    this.props.reminderSent = true;

    this.touch();
  }

  markNoShow(): void {
    if (
      this.props.status !== InterviewStatus.SCHEDULED &&
      this.props.status !== InterviewStatus.RESCHEDULED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_CANNOT_MARK_NO_SHOW);
    }

    if (new Date() < this.props.scheduledAt) {
      throw new DomainError(DOMAIN_ERROR_CODES.INTERVIEW_NOT_STARTED_YET);
    }

    this.props.status = InterviewStatus.NO_SHOW;

    this.touch();
  }

  canStart(): boolean {
    return (
      this.props.status === InterviewStatus.SCHEDULED ||
      this.props.status === InterviewStatus.RESCHEDULED
    );
  }
  canBeRescheduled(): boolean {
    return (
      this.props.status === InterviewStatus.SCHEDULED ||
      this.props.status === InterviewStatus.RESCHEDULED
    );
  }
  canComplete(): boolean {
    return this.props.status === InterviewStatus.ONGOING;
  }

  canCancel(): boolean {
    return (
      this.props.status !== InterviewStatus.COMPLETED &&
      this.props.status !== InterviewStatus.CANCELLED &&
      this.props.status !== InterviewStatus.NO_SHOW
    );
  }

  canJoin(): boolean {
    return this.props.status === InterviewStatus.ONGOING;
  }

  canReschedule(): boolean {
    return (
      this.props.status === InterviewStatus.SCHEDULED ||
      this.props.status === InterviewStatus.RESCHEDULED
    );
  }

  canSendReminder(): boolean {
    return (
      !this.props.reminderSent &&
      (this.props.status === InterviewStatus.SCHEDULED ||
        this.props.status === InterviewStatus.RESCHEDULED)
    );
  }

  hasPendingRescheduleRequest(): boolean {
    return this.props.rescheduleRequested;
  }

  hasCandidateResponded(): boolean {
    return (
      this.props.candidateResponseStatus !== CandidateResponseStatus.PENDING
    );
  }

  canAccept(): boolean {
    return (
      this.props.status !== InterviewStatus.CANCELLED &&
      this.props.status !== InterviewStatus.COMPLETED &&
      this.props.candidateResponseStatus === CandidateResponseStatus.PENDING
    );
  }

  canReject(): boolean {
    return (
      this.props.status !== InterviewStatus.CANCELLED &&
      this.props.status !== InterviewStatus.COMPLETED &&
      this.props.candidateResponseStatus === CandidateResponseStatus.PENDING
    );
  }

  canRequestReschedule(): boolean {
    return (
      (this.props.status === InterviewStatus.SCHEDULED ||
        this.props.status === InterviewStatus.RESCHEDULED) &&
      !this.props.rescheduleRequested &&
      this.props.candidateResponseStatus !== CandidateResponseStatus.DECLINED
    );
  }

  canApproveReschedule(): boolean {
    return (
      this.props.rescheduleRequested &&
      this.props.status !== InterviewStatus.CANCELLED &&
      this.props.status !== InterviewStatus.COMPLETED
    );
  }
  canRejectRescheduleRequest(): boolean {
    return (
      this.props.rescheduleRequested &&
      this.props.status !== InterviewStatus.CANCELLED &&
      this.props.status !== InterviewStatus.COMPLETED
    );
  }

  isOnlineInterview(): boolean {
    return this.props.mode === InterviewMode.ONLINE;
  }

  isOfflineInterview(): boolean {
    return this.props.mode === InterviewMode.OFFLINE;
  }

  isScheduled(): boolean {
    return this.props.status === InterviewStatus.SCHEDULED;
  }

  isRescheduled(): boolean {
    return this.props.status === InterviewStatus.RESCHEDULED;
  }

  isOngoing(): boolean {
    return this.props.status === InterviewStatus.ONGOING;
  }

  isCompleted(): boolean {
    return this.props.status === InterviewStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.props.status === InterviewStatus.CANCELLED;
  }

  isNoShow(): boolean {
    return this.props.status === InterviewStatus.NO_SHOW;
  }

  belongsToCandidate(candidateId: string): boolean {
    return this.props.candidateId === candidateId;
  }

  belongsToRecruiter(recruiterId: string): boolean {
    return this.props.recruiterId === recruiterId;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toObject(): InterviewProps {
    return {
      ...this.props,
    };
  }
}
