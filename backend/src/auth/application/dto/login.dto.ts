export interface LoginDTO{
    email:string;
    password : string;
    requiredRole? : "admin" | "candidate"| "recruiter";
}