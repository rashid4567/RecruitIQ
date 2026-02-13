export class Email {
  private readonly value: string;
  constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    if (!raw) {
      throw new Error("Email is required");
    }

    const normalized = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error("Invalid email format");
    }

    return new Email(normalized);
  }

  getValue(): string {
    return this.value;
  }
}
