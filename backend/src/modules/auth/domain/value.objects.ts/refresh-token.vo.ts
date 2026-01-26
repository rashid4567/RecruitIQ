export class RefreshToken{
    private constructor(private readonly value : string){};
    public static create(raw : string):RefreshToken{
        if(!raw){
            throw new Error("Refresh token is required")
        }
        return new RefreshToken(raw);
    }

    public getValue():string{
        return this.value;
    }
    
}