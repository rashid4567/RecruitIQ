import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

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

    return new User(id, fullName, email, profileImage);
  }

  public static fromPresistance(props: {
    id: UserId;
    fullName: string;
    email: Email;
    profileImage: string;
  }): User {
    return new User(props.id, props.fullName, props.email, props.profileImage);
  }

  public updateFullName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Full name cannot be empty");
    }

    this.fullName = name;
  }

  public updateEmail(email: Email): void {
    this.email = email;
  }

  public updateProfileImage(image?: string): void {
    this.profileImage = image;
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
