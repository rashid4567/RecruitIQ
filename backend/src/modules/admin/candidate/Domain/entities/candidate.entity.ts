import { Email } from "../../../../../shared/domain/value-objects.ts/email.vo";
import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";


export class Candidate {
  private constructor(
    private readonly id: UserId,
    private readonly name: string,
    private readonly email: Email,
    private readonly isActive: boolean
  ) {}

  public static fromPersistence(props: {
    id: UserId;
    name: string;
    email: Email;
    isActive: boolean;
  }): Candidate {
    return new Candidate(
      props.id,
      props.name,
      props.email,
      props.isActive
    );
  }

  canBeActivated(): boolean {
    return !this.isActive;
  }

  canBeDeactivated(): boolean {
    return this.isActive;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  isActiveAccount(): boolean {
    return this.isActive;
  }
}
