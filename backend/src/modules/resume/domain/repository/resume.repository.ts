import { BaseRepository } from "../../../../shared/repositories/base.repository";
import {
  ParsedResumeData,
  Resume,
  ResumeParseStatus,
} from "../entity/resume.entity";

export interface ResumeRepository extends BaseRepository<Resume> {
  create(resume: Resume): Promise<Resume>;
  update(resume: Resume): Promise<Resume>;
  findByCandidateId(candidateId: string): Promise<Resume | null>;
  delete(id: string): Promise<void>;
  updateParsedData(
    resumeId: string,
    parsedData: ParsedResumeData,
  ): Promise<void>;
  updateParseStatus(resumeId: string, status: ResumeParseStatus): Promise<void>;
}
