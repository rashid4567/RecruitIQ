import type { Resume } from "../entity/Resume.entity";

export interface ResumeRepository {
  uploadResume(file: File): Promise<Resume>;
  getMyResume(): Promise<Resume>;
  getDownloadUrl(): Promise<string>;
  deleteResume(): Promise<void>;
}
