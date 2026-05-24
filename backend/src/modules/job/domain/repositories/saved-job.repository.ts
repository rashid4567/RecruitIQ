import { SavedJob } from "../entities/saved-job.entity";

export interface SavedJobRepository {
  save(savedJob: SavedJob): Promise<SavedJob>;
  remove(
    candidateId: string,
    jobId: string,
  ): Promise<void>;
  findSavedJobs(candidateId: string): Promise<SavedJob[]>;
  findExisting(
    candidateId: string,
    jobId: string,
  ): Promise<SavedJob | null>;
}
