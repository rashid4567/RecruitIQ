import { Resume } from "../entity/Resume.entity";

export interface ResumeRepository {
  uploadResume(file: File): Promise<Resume>;
  getMyResume(): Promise<Resume>;
 getDownloadUrl(resumeId: string): Promise<string>;
  deleteResume(): Promise<void>;
}