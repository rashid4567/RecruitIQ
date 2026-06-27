import type { AuthResponse, UserRole } from "./auth.types";

export type GoogleRole = Exclude<UserRole, "admin">;

export interface GoogleLoginPayload {
  credential: string;
  role?: GoogleRole;
}

export interface GoogleLoginResponse extends AuthResponse {}

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}