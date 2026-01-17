import { User } from "../../domain/entities/user.entity";

export interface TokenServicePort{
    generateToken(user : User):{
        accessToken : string,
        refreshToken : string,
    },
    verifyToken(token : string):{
        userId : string,
        role : string,
    },
    generatePasswordResetToken(userId : string):string;
    verifyPasswordResetToken(token : string):{
        userId : string,
    }
}