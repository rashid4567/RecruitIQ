import { randomBytes } from "crypto";

export  class ResetToken {
    private readonly value : string;
    private constructor(value : string){
        this.value = value;
    }

    public static generate():ResetToken{
        const raw = randomBytes(32).toString("hex");
        return new ResetToken(raw);
    }

    public static create(rawToken : string):ResetToken{
        if(!rawToken){
            throw new Error("Reset Token is required")
        }
        const token = rawToken.trim();
        if(token.length < 32){
            throw new Error("Invalid reset token")
        }
        if(!/^[a-zA-Z0-9_-]+$/.test(token)){
            throw new Error("Invalid rest token format")
        }
        return new ResetToken(token)
    }
    

    public getValue():string{
        return this.value;
    }

    public equals(other : ResetToken):boolean{
        return this.value === other.value;
    }
}