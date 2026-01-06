export type SystemRole = "admin" | "recruiter" | "candidate";
export type RegisterRole = "recruiter" | "candidate";

export interface RegisterInput {
  email: string;
  password: string;
  role: RegisterRole;
  fullName: string;
  companyName?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: SystemRole;
  fullName: string;
}
