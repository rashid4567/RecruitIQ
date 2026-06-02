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
  private constructor(
    private readonly id: string | undefined,
    private readonly candidateId: string,
    private fileName: string,
    private fileKey: string,
    private uploadedAt: Date,
    private parsedData?: ParsedResumeData,
  ) {}

  static create(
    candidateId: string,
    fileName: string,
    fileKey: string,
  ): Resume {
    return new Resume(undefined, candidateId, fileName, fileKey, new Date());
  }

  static fromPersistence(props: {
    id: string;
    candidateId: string;
    fileName: string;
    fileKey: string;
    uploadedAt: Date;
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
      parsedData: this.parsedData,
    };
  }
}
