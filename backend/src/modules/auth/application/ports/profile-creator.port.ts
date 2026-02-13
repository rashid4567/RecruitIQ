export interface ProfileCreatorPort {
    createCandidateProfile(userId : string):Promise<void>
    createRecruiterProfile(userId : string):Promise<void>
}