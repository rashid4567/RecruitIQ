import type { JobApplication } from "../../../domain/entity/job-application.entity";
import type { ApplyJobDTO, JobApplicationRepository } from "../../../domain/repository/application.repository";

export class ApplyJobUseCase{
    private readonly applyRepo : JobApplicationRepository;
    constructor(
        applyRepo : JobApplicationRepository
    ){
        this.applyRepo = applyRepo;
    }

    async execute(data : ApplyJobDTO):Promise<JobApplication>{
        return this.applyRepo.apply(data);
    }
}
