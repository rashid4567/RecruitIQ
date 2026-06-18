import { JobApplication } from "../../domain/entity/job-application.entity";

export interface IGetMyApplications {
  execute(candidateId: string): Promise<JobApplication[]>;
}