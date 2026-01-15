import { CandidateProfile } from "../entities/candidate-profile.entity";

export interface CandidateRespository{
    findByUserId(userId : string):Promise<CandidateProfile|null>
    update(userId : string, data : Partial<CandidateProfile>):Promise<CandidateProfile>;
}

