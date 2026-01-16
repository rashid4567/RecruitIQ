export interface RecruiterProfileDTO{
    companyName?:string,
    companyWebstite?:string,
    industry?:string,
    designation?:string,
    location?:string,
    bio?:string,
}

export interface UserProfileDTO{
    fullName?:string,
    email?:string,
    profileImage?:string,
}

export interface RecruiterProfileReponse{
    user : UserProfileDTO,
    recruiter : RecruiterProfileDTO,
}