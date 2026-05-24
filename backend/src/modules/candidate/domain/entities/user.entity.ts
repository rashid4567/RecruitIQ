import { Email } from "../../../../shared/value-objects/email.vo";
import { UserId } from "../../../../shared/value-objects/userId.vo";

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
      throw new Error("Full name is required");
    }

    return new User(
      id,
      fullName.trim(),
      email,
      profileImage?.trim(),
    );
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
      throw new Error("Full name cannot be empty");
    }
    this.fullName = name.trim();
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public updateProfileImage(image?: string): void {
    if (image && !image.startsWith("http")) {
      throw new Error("Invalid profile image URL");
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