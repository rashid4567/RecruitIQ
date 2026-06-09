import type { JobApplicationRepository } from "@/module/job-application/domain/repository/application.repository";

export class WithdrawApplicationUseCase{
    private readonly ApplicationRepo : JobApplicationRepository;
    constructor(
         ApplicationRepo : JobApplicationRepository
    ){
        this.ApplicationRepo = ApplicationRepo;
    }

    execute(applicationId : string):Promise<void>{
        return this.ApplicationRepo.withdraw(applicationId);
    }
}