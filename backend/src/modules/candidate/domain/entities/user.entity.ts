import { Email } from "../valueObject/email.vo";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { DomainError } from "../../../../shared/errors/domain.error";
import { DOMAIN_ERROR_CODES } from "../../../../shared/constants/domain.error.code";

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
    if (!fullName || fullName.trim().length === 0) {
      throw new DomainError(DOMAIN_ERROR_CODES.FULL_NAME_IS_REQUIRED);
    }

    return new User(id, fullName.trim(), email, profileImage?.trim());
  }

  public static fromPersistence(props: {
    id: UserId;
    fullName: string;
    email: Email;
    profileImage?: string;
  }): User {
    return new User(
      props.id,
      props.fullName.trim(),
      props.email,
      props.profileImage?.trim(),
    );
  }

  public updateFullName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainError(DOMAIN_ERROR_CODES.FULL_NAME_CANNOT_BE_EMPTY);
    }
    this.fullName = name.trim();
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public updateProfileImage(image?: string): void {
    if (image && !image.startsWith("http")) {
      throw new DomainError(DOMAIN_ERROR_CODES.INVALID_PROFILE_IMAGE_URL);
    }
    this.profileImage = image?.trim();
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
