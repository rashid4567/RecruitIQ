import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPost } from "../../../Domain/entities/jobPost-entity";
import { JobPostRepostory } from "../../../Domain/repositories/jobPost-repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class GetJobPostByIdUseCase{
    constructor(private repo : JobPostRepostory){};

    async execute(id : string):Promise<JobPost>{
        if(!id){
            throw new ApplicationError(ERROR_CODES.JOB_POST_ID_NOT_FOUND)
        }

        const jobPost = await this.repo.findById(id);

        if(!jobPost){
            throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND)
        }

        return jobPost;
    }
}