export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(raw: string): Password {
    if (!raw) {
      throw new Error("Password is required");
    }
    if (raw.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(raw)) {
      throw new Error("Password must include a capital letter");
    }
    if (!/[a-z]/.test(raw)) {
      throw new Error("Password must include a small letter");
    }
    if (!/[0-9]/.test(raw)) {
      throw new Error("Password must include a digit");
    }

    return new Password(raw);
  }

  public getValue(): string {
    return this.value;
  }
}
