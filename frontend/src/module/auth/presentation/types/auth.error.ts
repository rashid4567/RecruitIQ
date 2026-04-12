// src/module/auth/presentation/types/auth-error.ts
export type AuthErrorType = "blocked" | "generic";

export interface AuthError {
  message: string;
  type: AuthErrorType;
}