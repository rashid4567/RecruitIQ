import type { UserRole } from "../constants/user-role";

export class AuthUser {
  public readonly id: string;
  public readonly role: UserRole;
  public readonly fullName?: string;
  constructor(id: string, role: UserRole, fullName?: string) {
    this.id = id;
    this.role = role;
    this.fullName = fullName;
  }
}
