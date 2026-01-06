export interface jwtPayload {
    userId : string,
    role : "recruiter" | "candidate" | "admin"
}