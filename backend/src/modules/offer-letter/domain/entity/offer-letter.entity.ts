import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";
import { DomainError } from "../../../../shared/errors/domain.error";

export enum OfferStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
  FREELANCE = "FREELANCE",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export interface OfferProps {
  id?: string;
  offerNumber: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  companyName: string;
  jobTitle: string;
  annualCTC: number;
  currency: Currency;
  employmentType: EmploymentType;
  department?: string;
  workLocation: string;
  joiningDate: Date;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: Date;
  expiryDate: Date;
  status: OfferStatus;
  offerLetterUrl?: string;
  sentAt?: Date;
  viewedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  candidateRemarks?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Offer {
  private constructor(private props: OfferProps) {
    this.validate();
  }

  static create(
    props: Omit<
      OfferProps,
      | "id"
      | "status"
      | "offerLetterUrl"
      | "sentAt"
      | "viewedAt"
      | "acceptedAt"
      | "rejectedAt"
      | "candidateRemarks"
      | "isDeleted"
      | "createdAt"
      | "updatedAt"
    >,
  ): Offer {
    return new Offer({
      ...props,
      status: OfferStatus.DRAFT,
      offerLetterUrl: undefined,
      sentAt: undefined,
      viewedAt: undefined,
      acceptedAt: undefined,
      rejectedAt: undefined,
      candidateRemarks: undefined,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static rehydrate(props: OfferProps): Offer {
    return new Offer(props);
  }

  private validate(): void {
    if (!this.props.offerNumber?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_NUMBER_REQUIRED);
    }

    if (!this.props.applicationId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.APPLICATION_REQUIRED);
    }

    if (!this.props.jobId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.JOB_REQUIRED);
    }

    if (!this.props.candidateId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.CANDIDATE_REQUIRED);
    }

    if (!this.props.recruiterId?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.RECRUITER_REQUIRED);
    }

    if (!this.props.companyName?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.COMPANY_NAME_REQUIRED);
    }

    if (!this.props.jobTitle?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.JOB_TITLE_REQUIRED);
    }

    if (this.props.annualCTC <= 0) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_ANNUAL_CTC);
    }

    if (!this.props.currency) {
      throw new DomainError(DOMAIN_ERROR_CODES.CURRENCY_REQUIRED);
    }

    if (!this.props.employmentType) {
      throw new DomainError(DOMAIN_ERROR_CODES.EMPLOYMENT_TYPE_REQUIRED);
    }

    if (!this.props.workLocation?.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.WORK_LOCATION_REQUIRED);
    }

    if (!this.props.joiningDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.JOINING_DATE_REQUIRED);
    }

    if (!this.props.offerDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_DATE_REQUIRED);
    }

    if (!this.props.expiryDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_EXPIRY_REQUIRED);
    }

    if (this.props.expiryDate <= this.props.offerDate) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_OFFER_EXPIRY_DATE);
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private ensureEditable(): void {
    if (this.props.status === OfferStatus.ACCEPTED) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_ALREADY_ACCEPTED);
    }

    if (this.props.status === OfferStatus.REJECTED) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_ALREADY_REJECTED);
    }

    if (this.props.status === OfferStatus.EXPIRED) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_ALREADY_EXPIRED);
    }

    if (this.props.status === OfferStatus.REVOKED) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_ALREADY_REVOKED);
    }
  }

  sendOffer(offerLetterUrl: string): void {
    this.ensureEditable();

    if (this.props.status !== OfferStatus.DRAFT) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_CANNOT_BE_SENT);
    }

    if (!offerLetterUrl.trim()) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_LETTER_URL_REQUIRED);
    }

    this.props.offerLetterUrl = offerLetterUrl;
    this.props.status = OfferStatus.SENT;
    this.props.sentAt = new Date();

    this.touch();
  }

  markViewed(): void {
    if (
      this.props.status !== OfferStatus.SENT &&
      this.props.status !== OfferStatus.VIEWED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_NOT_SENT);
    }

    if (!this.props.viewedAt) {
      this.props.viewedAt = new Date();
    }

    this.props.status = OfferStatus.VIEWED;

    this.touch();
  }

  accept(remarks?: string): void {
    if (
      this.props.status !== OfferStatus.SENT &&
      this.props.status !== OfferStatus.VIEWED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_CANNOT_BE_ACCEPTED);
    }

    this.props.status = OfferStatus.ACCEPTED;
    this.props.acceptedAt = new Date();
    this.props.candidateRemarks = remarks?.trim() || undefined;

    this.touch();
  }

  reject(remarks?: string): void {
    if (
      this.props.status !== OfferStatus.SENT &&
      this.props.status !== OfferStatus.VIEWED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_CANNOT_BE_REJECTED);
    }

    this.props.status = OfferStatus.REJECTED;
    this.props.rejectedAt = new Date();
    this.props.candidateRemarks = remarks?.trim() || undefined;

    this.touch();
  }

  expire(): void {
    if (
      this.props.status === OfferStatus.ACCEPTED ||
      this.props.status === OfferStatus.REJECTED ||
      this.props.status === OfferStatus.REVOKED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_CANNOT_BE_EXPIRED);
    }

    this.props.status = OfferStatus.EXPIRED;

    this.touch();
  }

  revoke(): void {
    if (
      this.props.status === OfferStatus.ACCEPTED ||
      this.props.status === OfferStatus.REJECTED
    ) {
      throw new DomainError(DOMAIN_ERROR_CODES.OFFER_CANNOT_BE_REVOKED);
    }

    this.props.status = OfferStatus.REVOKED;

    this.touch();
  }

  updateOffer(data: {
    annualCTC?: number;
    currency?: Currency;
    employmentType?: EmploymentType;
    department?: string;
    workLocation?: string;
    joiningDate?: Date;
    probationPeriod?: string;
    benefits?: string[];
    notes?: string;
    expiryDate?: Date;
  }): void {
    this.ensureEditable();

    if (data.annualCTC !== undefined) {
      if (data.annualCTC <= 0) {
        throw new DomainError(DOMAIN_ERROR_CODES.INVALID_ANNUAL_CTC);
      }

      this.props.annualCTC = data.annualCTC;
    }

    if (data.currency !== undefined) {
      this.props.currency = data.currency;
    }

    if (data.employmentType !== undefined) {
      this.props.employmentType = data.employmentType;
    }

    if (data.department !== undefined) {
      this.props.department = data.department;
    }

    if (data.workLocation !== undefined) {
      this.props.workLocation = data.workLocation;
    }

    if (data.joiningDate !== undefined) {
      this.props.joiningDate = data.joiningDate;
    }

    if (data.probationPeriod !== undefined) {
      this.props.probationPeriod = data.probationPeriod;
    }

    if (data.benefits !== undefined) {
      this.props.benefits = [...data.benefits];
    }

    if (data.notes !== undefined) {
      this.props.notes = data.notes;
    }

    if (data.expiryDate !== undefined) {
      if (data.expiryDate <= this.props.offerDate) {
        throw new DomainError(DOMAIN_ERROR_CODES.INVALID_OFFER_EXPIRY_DATE);
      }

      this.props.expiryDate = data.expiryDate;
    }

    this.touch();
  }
  canSend(): boolean {
    return this.props.status === OfferStatus.DRAFT;
  }

  canEdit(): boolean {
    return (
      this.props.status === OfferStatus.DRAFT ||
      this.props.status === OfferStatus.SENT
    );
  }

  canAccept(): boolean {
    return (
      this.props.status === OfferStatus.SENT ||
      this.props.status === OfferStatus.VIEWED
    );
  }

  canReject(): boolean {
    return (
      this.props.status === OfferStatus.SENT ||
      this.props.status === OfferStatus.VIEWED
    );
  }

  canView(): boolean {
    return (
      this.props.status === OfferStatus.SENT ||
      this.props.status === OfferStatus.VIEWED ||
      this.props.status === OfferStatus.ACCEPTED
    );
  }

  canExpire(): boolean {
    return (
      this.props.status === OfferStatus.SENT ||
      this.props.status === OfferStatus.VIEWED
    );
  }

  canRevoke(): boolean {
    return (
      this.props.status === OfferStatus.DRAFT ||
      this.props.status === OfferStatus.SENT ||
      this.props.status === OfferStatus.VIEWED
    );
  }

  isDraft(): boolean {
    return this.props.status === OfferStatus.DRAFT;
  }

  isSent(): boolean {
    return this.props.status === OfferStatus.SENT;
  }

  isViewed(): boolean {
    return this.props.status === OfferStatus.VIEWED;
  }

  isAccepted(): boolean {
    return this.props.status === OfferStatus.ACCEPTED;
  }
  softDelete(): void {
  this.props.isDeleted = true;
  this.touch();
}

  isRejected(): boolean {
    return this.props.status === OfferStatus.REJECTED;
  }

  isExpired(): boolean {
    return this.props.status === OfferStatus.EXPIRED;
  }

  isRevoked(): boolean {
    return this.props.status === OfferStatus.REVOKED;
  }

  belongsToCandidate(candidateId: string): boolean {
    return this.props.candidateId === candidateId;
  }

  belongsToRecruiter(recruiterId: string): boolean {
    return this.props.recruiterId === recruiterId;
  }

  toObject(): OfferProps {
    return {
      ...this.props,
      benefits: [...this.props.benefits],
    };
  }

  get id(): string {
    if (!this.props.id) {
      throw new DomainError(ERROR_CODES.OFFER_ID_IS_MISSING);
    }

    return this.props.id;
  }

  get offerNumber(): string {
    return this.props.offerNumber;
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

  get companyName(): string {
    return this.props.companyName;
  }

  get jobTitle(): string {
    return this.props.jobTitle;
  }

  get annualCTC(): number {
    return this.props.annualCTC;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  get employmentType(): EmploymentType {
    return this.props.employmentType;
  }

  get department(): string | undefined {
    return this.props.department;
  }

  get workLocation(): string {
    return this.props.workLocation;
  }

  get joiningDate(): Date {
    return this.props.joiningDate;
  }

  get probationPeriod(): string | undefined {
    return this.props.probationPeriod;
  }

  get benefits(): string[] {
    return [...this.props.benefits];
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get offerDate(): Date {
    return this.props.offerDate;
  }

  get expiryDate(): Date {
    return this.props.expiryDate;
  }

  get status(): OfferStatus {
    return this.props.status;
  }

  get offerLetterUrl(): string | undefined {
    return this.props.offerLetterUrl;
  }

  get sentAt(): Date | undefined {
    return this.props.sentAt;
  }

  get viewedAt(): Date | undefined {
    return this.props.viewedAt;
  }

  get acceptedAt(): Date | undefined {
    return this.props.acceptedAt;
  }

  get rejectedAt(): Date | undefined {
    return this.props.rejectedAt;
  }

  get candidateRemarks(): string | undefined {
    return this.props.candidateRemarks;
  }

  get isDeleted(): boolean {
  return this.props.isDeleted;
}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
