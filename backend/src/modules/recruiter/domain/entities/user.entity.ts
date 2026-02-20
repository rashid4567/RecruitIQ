import { Email } from "../../../../shared/value-objects.ts/email.vo";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../constatns/recruiter.profile.error";

export class User {
  private constructor(
    private readonly id: UserId,
    private fullName: string,
    private email: Email,
    private profileImage?: string,
  ) {}

  public static create(
    id: UserId,
    fullName: string,
    email: Email,
    profileImage?: string,
  ): User {
    if (!fullName?.trim()) {
      throw new DomainError(ERROR_CODES.FULL_NAME_REQUIRED);
    }

    return new User(
      id,
      fullName.trim(),
      email,
      profileImage?.trim() || undefined,
    );
  }

  public static fromPersistence(props: {
    id: UserId;
    fullName: string;
    email: Email;
    profileImage?: string;
  }): User {
    return new User(props.id, props.fullName, props.email, props.profileImage);
  }

  public updateFullName(name: string): void {
    if (!name?.trim()) {
      throw new DomainError(ERROR_CODES.FULL_NAME_EMPTY);
    }

    this.fullName = name.trim();
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public updateProfileImage(image?: string): void {
    this.profileImage = image?.trim() || undefined;
  }

  public getId(): UserId {
    return this.id;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getProfileImage(): string | undefined {
    return this.profileImage;
  }
}
