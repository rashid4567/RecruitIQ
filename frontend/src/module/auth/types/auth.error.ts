
export type AuthErrorType = "blocked" | "generic";

export interface AuthError {
  message: string;
  type: AuthErrorType;
}