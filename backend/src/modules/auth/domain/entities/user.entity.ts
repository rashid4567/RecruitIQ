export type AuthProvider = "local" | "google" | "linkedin"

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "admin" | "candidate" | "recruiter",
    public readonly fullName: string,
    public readonly isActive: boolean,
    public readonly authProvider : AuthProvider,
    public readonly googleId?: string
  ) {}
}
