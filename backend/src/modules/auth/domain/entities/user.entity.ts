import { userRoles } from "../constants/roles.constants";
import { AuthProvider } from "../value.objects.ts/auth-provider.vo"; 
import { Email } from "../value.objects.ts/email.vo"; 
import { GoogleId } from "../value.objects.ts/google-id.vo"; 
import { Password } from "../value.objects.ts/password.vo"; 
import { PasswordHasherPort  } from "../../application/ports/password.service.port"; 

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly role: userRoles,
    public readonly fullName: string,
    private readonly isActive: boolean,
    public readonly authProvider: AuthProvider,
    private readonly passwordHash?: string,
    public readonly googleId?: GoogleId
  ) {}

  public static register(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    passwordHash: string;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.local(),
      params.passwordHash
    );
  }


  public static registerWithGoogle(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    googleId: GoogleId;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.google(),
      undefined,
      params.googleId
    );
  }

  public canLogin(): boolean {
    return this.isActive;
  }

  public async verifyPassword(
    password: Password,
    hasher: PasswordHasherPort 
  ): Promise<boolean> {
    if (!this.passwordHash) {
      return false; 
    }
    return hasher.compare(password, this.passwordHash);
  }
}
 