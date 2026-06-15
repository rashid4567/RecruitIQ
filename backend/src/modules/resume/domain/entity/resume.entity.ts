export interface ParsedResumeData {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  totalExperienceYears?: number | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  currentCompany?: string | null;
  currentRole?: string | null;
}
export const ResumeParseStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type ResumeParseStatus =
  (typeof ResumeParseStatus)[keyof typeof ResumeParseStatus];

export class Resume {
  private constructor(
    private readonly id: string | undefined,
    private readonly candidateId: string,
    private fileName: string,
    private fileKey: string,
    private uploadedAt: Date,
    private parseStatus: ResumeParseStatus,
    private parsedData?: ParsedResumeData,
  ) {}

  static create(
    candidateId: string,
    fileName: string,
    fileKey: string,
  ): Resume {
    return new Resume(
      undefined,
      candidateId,
      fileName,
      fileKey,
      new Date(),
      ResumeParseStatus.PENDING,
    );
  }

  static fromPersistence(props: {
    id: string;
    candidateId: string;
    fileName: string;
    fileKey: string;
    uploadedAt: Date;
    parseStatus: ResumeParseStatus;
    parsedData?: ParsedResumeData;
  }): Resume {
    return new Resume(
      props.id,
      props.candidateId,
      props.fileName,
      props.fileKey,
      props.uploadedAt,
      props.parseStatus,
      props.parsedData,
    );
  }

  public updateParsedData(parsedData: ParsedResumeData): void {
    this.parsedData = parsedData;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getCandidateId(): string {
    return this.candidateId;
  }

  public getFileName(): string {
    return this.fileName;
  }

  public getFileKey(): string {
    return this.fileKey;
  }

  public getUploadedAt(): Date {
    return this.uploadedAt;
  }

  public getParsedStatus(): ResumeParseStatus {
    return this.parseStatus;
  }

  public getParseStatus(): ResumeParseStatus {
    return this.parseStatus;
  }

  public markProcessing(): void {
    this.parseStatus = ResumeParseStatus.PROCESSING;
  }

  public markCompleted(parsedData: ParsedResumeData): void {
    this.parsedData = parsedData;
    this.parseStatus = ResumeParseStatus.COMPLETED;
  }

  public markFailed(): void {
    this.parseStatus = ResumeParseStatus.FAILED;
  }
  public getParsedData(): ParsedResumeData | undefined {
    return this.parsedData;
  }

  public toJSON() {
    return {
      id: this.id,
      candidateId: this.candidateId,
      fileName: this.fileName,
      fileKey: this.fileKey,
      uploadedAt: this.uploadedAt,
      parseStatus : this.parseStatus,
      parsedData: this.parsedData,
    };
  }
}
