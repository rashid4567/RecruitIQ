export type AuthProviderType = "local" | "google";

export class AuthProvider {
  private constructor(private readonly type: AuthProviderType) {}

  public static local(): AuthProvider {
    return new AuthProvider("local");
  }

  public static google(): AuthProvider {
    return new AuthProvider("google");
  }

  public isLocal(): boolean {
    return this.type === "local";
  }

  public isGoogle(): boolean {
    return this.type === "google";
  }


  public getValue(): AuthProviderType {
    return this.type;
  }
}
