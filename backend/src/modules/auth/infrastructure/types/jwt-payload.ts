export interface JwtPayload {
  userId: string;

  role:
    | "recruiter"
    | "candidate"
    | "admin";
}