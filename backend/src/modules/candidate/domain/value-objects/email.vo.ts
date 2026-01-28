export class Email {
  private constructor(private readonly value: string) {}

  public static create(value: string): Email {
    if (!value) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Invalid email format");
    }

    return new Email(value.trim().toLowerCase());
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }
}
