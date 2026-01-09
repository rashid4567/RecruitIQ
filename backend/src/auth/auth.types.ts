export type SystemRole = "admin" | "recruiter" | "candidate";
export type RegisterRole = "recruiter" | "candidate";

export interface RegisterInput {
  email: string;
  password: string;
  role: "candidate" | "recruiter";
  fullName: string;
  
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: "candidate" | "recruiter" | "admin";
  fullName: string;
  authProvider?: "local" | "google";
  googleId?: string,
}

export interface AuthUser {
  id: string;
  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
  isProfileComplete: boolean;
}
