import { ApplicationError }
from "../../../../../shared/errors/application.error";

import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { Job }
from "../../../domain/entities/job.entity";

import { JobRepository }
from "../../../domain/repositories/job.repository";

export class GetJobByIdUseCase {

 constructor(
  private readonly repo:
  JobRepository
 ) {}

 async execute(
  jobId:string
 ):Promise<Job>{

  if(!jobId){
   throw new ApplicationError(
    ERROR_CODES
    .JOB_POST_NOT_FOUND
   );
  }

  const job =
  await this.repo.findById(
   jobId
  );

  if(!job){
   throw new ApplicationError(
    ERROR_CODES
    .JOB_POST_NOT_FOUND
   );
  }

  return job;
 }
}