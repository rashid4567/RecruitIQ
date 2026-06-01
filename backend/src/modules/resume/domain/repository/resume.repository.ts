import { Resume } from "../entity/resume.entity";

export interface ResumeRepository {
  create(resume: Resume): Promise<Resume>;
  update(resume: Resume): Promise<Resume>;
  findById(id: string): Promise<Resume | null>;
  findByCandidateId(candidateId: string): Promise<Resume | null>;
  delete(id: string): Promise<void>;
}
