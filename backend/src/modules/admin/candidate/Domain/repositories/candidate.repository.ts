import { Candidate } from "../entities/candidate.entity"

export interface CandidateRepository{
    getCandidates(input : {
        search : string,
        status : "Active"| "Blocked" | "All",
        skip: number,
        limit : number,
    }):Promise<{
        candidates : Candidate[];
        total : number;
    }>

    getCandidateProfile(candidateId : string):Promise<Candidate | null>
    updateCandidateStatus(candidateId  :string, isActive : boolean):Promise<void>;
}