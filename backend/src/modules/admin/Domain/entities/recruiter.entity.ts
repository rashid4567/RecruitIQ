export type VerificationStatus = "pending" | "verified" | "rejected";

export class Recruiter {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly verificationStatus: VerificationStatus,
  ) {}

  static fromPersistence(props: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    verificationStatus: VerificationStatus;
  }): Recruiter {
    return new Recruiter(
      props.id,
      props.name,
      props.email,
      props.isActive,
      props.verificationStatus,
    );
  }

  canBeVerified(): boolean {
    return this.verificationStatus === "pending";
  }

  canBeRejected(): boolean {
    return this.verificationStatus === "pending";
  }

  canBeActivated(): boolean {
    return !this.isActive;
  }

  verify(): Recruiter {
    if (!this.canBeVerified()) {
      throw new Error("Cannot verify recruiter");
    }

    return new Recruiter(
      this.id,
      this.name,
      this.email,
      this.isActive,
      "verified",
    );
  }

  reject(): Recruiter {
    if (!this.canBeRejected()) {
      throw new Error("Cannot reject recruiter");
    }

    return new Recruiter(
      this.id,
      this.name,
      this.email,
      this.isActive,
      "rejected",
    );
  }

  getId(): string {
    return this.id;
  }

  getVerificationStatus(): VerificationStatus {
    return this.verificationStatus;
  }

  isRecruiterActive(): boolean {
    return this.isActive;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }
}
