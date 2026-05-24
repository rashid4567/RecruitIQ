import { DomainError } from "../errors/domain.error";
import { JOB_ERRORS } from "../errors/job.error.codes";

export interface SavedJobProps {
  id?: string;
  candidateId: string;
  jobId: string;
  savedAt: Date;
}

export class SavedJob {
  private constructor(private props: SavedJobProps) {
    this.validate();
  }
  static save(candidateId: string, jobId: string): SavedJob {
    return new SavedJob({
      candidateId,
      jobId,
      savedAt: new Date(),
    });
  }
  static rehydrate(props: SavedJobProps): SavedJob {
    return new SavedJob(props);
  }
  private validate(): void {
    if (!this.props.candidateId.trim()) {
      throw new DomainError(JOB_ERRORS.CANDIDATE_REQUIRED);
    }
    if (!this.props.jobId.trim()) {
      throw new DomainError(JOB_ERRORS.JOB_REQUIRED);
    }
  }
  belongsToCandidate(candidateId: string): boolean {
    return this.props.candidateId === candidateId;
  }
  belongsToJob(jobId: string): boolean {
    return this.props.jobId === jobId;
  }
  canRemove(candidateId: string): boolean {
    return this.props.candidateId === candidateId;
  }
  isSameSave(candidateId: string, jobId: string): boolean {
    return this.props.candidateId === candidateId && this.props.jobId === jobId;
  }
  toObject(): SavedJobProps {
    return {
      ...this.props,
    };
  }
  get id() {
    return this.props.id;
  }
  get candidateId() {
    return this.props.candidateId;
  }
  get jobId() {
    return this.props.jobId;
  }
  get savedAt() {
    return this.props.savedAt;
  }
}
