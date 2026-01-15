import { CandidateRespository } from "../../domain/repositories/candidate.repository";

export class CompleteProfileCandidateProfileUseCase{
    constructor(private readonly repo : CandidateRespository){};
    async execute(userId : string, data  : any){
      return this.repo.update(userId,{
        ...data,
        profileCompleted : true,
      })
    }
}