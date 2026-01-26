export type AuthProviderType = "local" | "google";

export class AuthProvider {
    private constructor(private readonly value : AuthProviderType){};

    public static local():AuthProvider{
        return new AuthProvider("local")
    }
    public static google():AuthProvider{
        return new AuthProvider("google")
    }
    public isLocal():boolean{
        return this.value === "local"
    }

    public getValue():AuthProviderType{
        return this.value;
    }
}