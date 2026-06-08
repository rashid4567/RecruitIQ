import { userRoles } from "../constants/roles.constants";
import { AuthProvider } from "../../../../shared/value-objects/auth-provider.vo";
import { Email } from "../value.objects/email.vo";
import { GoogleId } from "../value.objects/google-id.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../constants/DomainError";

export class User {
  private constructor(
    public readonly id: string | undefined,
    public readonly email: Email,
    public readonly role: userRoles,
    public readonly fullName: string,
    private readonly isActive: boolean,
    public readonly authProvider: AuthProvider,
    private readonly passwordHash?: string,
    public readonly googleId?: GoogleId,
    public readonly profileImage?: string,
  ) {
    this.validateInvariants();
  }

  static register(params: {
    email: Email;
    role: userRoles;
    fullName: string;
    passwordHash: string;
  }): User {
    return new User(
      undefined,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.local(),
      params.passwordHash,
      undefined,
      undefined,
    );
  }

  static registerWithGoogle(params: {
    email: Email;
    role: userRoles;
    fullName: string;
    googleId: GoogleId;
  }): User {
    return new User(
      undefined,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.google(),
      undefined,
      params.googleId,
      undefined,
    );
  }

  static rehydrate(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    isActive: boolean;
    authProvider: AuthProvider;
    passwordHash?: string;
    googleId?: GoogleId;
    profileImage?: string;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      params.isActive,
      params.authProvider,
      params.passwordHash,
      params.googleId,
      params.profileImage,
    );
  }

  updateEmail(email: Email): User {
    if (!this.authProvider.isLocal()) {
      throw new DomainError(DOMAIN_ERROR_CODES.EMAIL_UPDATE_NOT_ALLOWED);
    }

    if (this.email.getValue() === email.getValue()) {
      return this;
    }

    return new User(
      this.id,
      email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      this.passwordHash,
      this.googleId,
      this.profileImage,
    );
  }

  changePasswordHash(newHash: string): User {
    if (!this.authProvider.isLocal()) {
      throw new DomainError(DOMAIN_ERROR_CODES.PASSWORD_CHANGE_NOT_ALLOWED);
    }

    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      newHash,
      this.googleId,
      this.profileImage,
    );
  }

  activate(): User {
    if (this.isActive) {
      return this;
    }

    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      true,
      this.authProvider,
      this.passwordHash,
      this.googleId,
      this.profileImage,
    );
  }

  deactivate(): User {
    if (!this.isActive) {
      return this;
    }

    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      false,
      this.authProvider,
      this.passwordHash,
      this.googleId,
      this.profileImage,
    );
  }

  updateProfileImage(imageKey: string): User {
    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      this.passwordHash,
      this.googleId,
      imageKey,
    );
  }

  removeProfileImage(): User {
    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      this.passwordHash,
      this.googleId,
      undefined,
    );
  }

  canLogin(): boolean {
    return this.isActive;
  }

  isLocalUser(): boolean {
    return this.authProvider.isLocal();
  }

  isGoogleUser(): boolean {
    return this.authProvider.isGoogle();
  }

  hasPassword(): boolean {
    return !!this.passwordHash;
  }

  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  private validateInvariants(): void {
    if (this.authProvider.isLocal() && !this.passwordHash) {
      throw new DomainError(DOMAIN_ERROR_CODES.LOCAL_USER_MUST_HAVE_PASSWORD);
    }

    if (this.authProvider.isGoogle() && !this.googleId) {
      throw new DomainError(DOMAIN_ERROR_CODES.GOOGLE_USER_MUST_HAVE_GOOGLE_ID);
    }

    if (this.authProvider.isGoogle() && this.passwordHash) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.GOOGLE_USER_CANNOT_HAVE_PASSWORD,
      );
    }
  }
}
