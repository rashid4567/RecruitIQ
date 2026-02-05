import { verificationStatus } from "../../../../recruiter/domain/constatns/verificationStatus.constants";

export type VerificationStatus = "pending" | "verified" | "rejected";

export class Recruiter {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly verficationStatus: VerificationStatus,
  ) {}

  public static fromPersistence(props: {
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
    return this.verficationStatus === "pending";
  }

  canBeRejected(): boolean {
    return this.verficationStatus === "pending";
  }

  canBeActivated(): boolean {
    return !this.isActive;
  }

  getId(): string {
    return this.id;
  }

  getVerificationStatus(): VerificationStatus {
    return this.verficationStatus;
  }

  isRecruiterIsActive(): boolean {
    return this.isActive;
  }
  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }
}
