export interface ParsedResumeData {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  totalExperienceYears?: number | null;
}

export class Resume {
  getFileSize() {
    throw new Error("Method not implemented.");
  }
     private readonly id: string;
    private readonly candidateId: string;
    private readonly fileName: string;
    private readonly fileKey: string;
    private readonly uploadedAt: string;
    private readonly parsedData?: ParsedResumeData;
  private constructor(
     id: string,
     candidateId: string,
     fileName: string,
     fileKey: string,
     uploadedAt: string,
     parsedData?: ParsedResumeData,
  ) {
    this.id = id;
    this.candidateId = candidateId;
    this.fileName = fileName;
    this.fileKey = fileKey;
    this.uploadedAt = uploadedAt;
    this.parsedData = parsedData;
  }

  static create(props: {
    id: string;
    candidateId: string;
    fileName: string;
    fileKey: string;
    uploadedAt: string;
    parsedData?: ParsedResumeData;
  }): Resume {
    return new Resume(
      props.id,
      props.candidateId,
      props.fileName,
      props.fileKey,
      props.uploadedAt,
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
      parsedData: this.parsedData,
    };
  }
}