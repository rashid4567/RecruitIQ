export class GoogleId {
  private constructor(private readonly value: string) {}

  public static create(value: string): GoogleId {
    if (!value) throw new Error("GoogleId is required");
    return new GoogleId(value);
  }

  public getValue(): string {
    return this.value;
  }
}
