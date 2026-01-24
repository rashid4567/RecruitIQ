import { ResetToken } from "../value.objects.ts/reset-token.vo";

export class PasswordReset{
    private constructor(
        public readonly userId : string,
        public readonly token : ResetToken,
        public readonly expiresAt: Date,
    ){};

    public static create(
        userId : string,
        token : ResetToken,
        expiresAt : Date,
    ):PasswordReset{
        if(!userId){
            throw new Error("User id is required")
        }
        if(expiresAt <= new Date()){
            throw new Error("Expiry token must be in the future")
        }
        return new PasswordReset(userId, token, expiresAt);
    }
    public isExpired(now : Date = new Date()):boolean{
        return this.expiresAt <= now;
    }
}