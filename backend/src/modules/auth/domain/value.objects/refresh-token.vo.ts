export class RefreshToken {
  private constructor(private readonly value: string) {}

  static create(token: string): RefreshToken {
    const normalized = token.trim();

    if (!normalized) {
      throw new Error("Refresh token required");
    }

    if (normalized.length < 20) {
      throw new Error("Invalid refresh token");
    }

    return new RefreshToken(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RefreshToken): boolean {
    return this.value === other.value;
  }
}
