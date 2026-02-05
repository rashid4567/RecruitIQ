export const GOOGLE_ROLES =  {
    CANDIDATE : "candidate",
    RECRUTER : "recruiter"
}

export type GoogleRoles  = (typeof GOOGLE_ROLES)[keyof typeof GOOGLE_ROLES]