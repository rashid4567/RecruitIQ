export class GoogleId {
  private constructor(private readonly value: string) {}

  static create(value: string): GoogleId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error("Google ID is required");
    }

    if (normalized.length < 5) {
      throw new Error("Invalid Google ID");
    }

    return new GoogleId(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: GoogleId): boolean {
    return this.value === other.value;
  }
}
