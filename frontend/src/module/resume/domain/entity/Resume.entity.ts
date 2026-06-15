export interface ParsedResumeData {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  totalExperienceYears?: number | null;
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

  private readonly id: string;
  private readonly candidateId: string;
  private readonly fileName: string;
  private readonly fileKey: string;
  private readonly uploadedAt: string;
  private readonly parseStatus: ResumeParseStatus;
  private readonly parsedData?: ParsedResumeData;

  private constructor(
    id: string,
    candidateId: string,
    fileName: string,
    fileKey: string,
    uploadedAt: string,
    parseStatus: ResumeParseStatus,
    parsedData?: ParsedResumeData,
  ) {
    this.id = id;
    this.candidateId = candidateId;
    this.fileName = fileName;
    this.fileKey = fileKey;
    this.uploadedAt = uploadedAt;
    this.parseStatus = parseStatus;
    this.parsedData = parsedData;
  }
  static create(props: {
    id: string;
    candidateId: string;
    fileName: string;
    fileKey: string;
    uploadedAt: string;
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

  getId(): string {
    return this.id;
  }

  getCandidateId(): string {
    return this.candidateId;
  }

  getFileName(): string {
    return this.fileName;
  }

  getFileKey(): string {
    return this.fileKey;
  }

  getUploadedAt(): string {
    return this.uploadedAt;
  }

  getParseStatus(): ResumeParseStatus {
    return this.parseStatus;
  }

  getParsedData(): ParsedResumeData | undefined {
    return this.parsedData;
  }

  toJSON() {
    return {
      id: this.id,
      candidateId: this.candidateId,
      fileName: this.fileName,
      fileKey: this.fileKey,
      uploadedAt: this.uploadedAt,
      parseStatus: this.parseStatus,
      parsedData: this.parsedData,
    };
  }
}
