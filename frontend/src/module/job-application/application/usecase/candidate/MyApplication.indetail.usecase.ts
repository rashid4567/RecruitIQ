import type { ApplicationDetailDTO, JobApplicationRepository } from "../../../domain/repository/application.repository";

export class GetApplicationDetailUseCase{
    private readonly applicationRepo : JobApplicationRepository;
    constructor(
        applicationRepo : JobApplicationRepository
    ){
        this.applicationRepo = applicationRepo
    }

    async execute(applicationId : string):Promise<ApplicationDetailDTO>{
        return this.applicationRepo.getById(applicationId)
    }
}