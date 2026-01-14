import { User } from "../../domain/entities/user.entity";

export interface TokenServicePort{
    generateToken(user : User):{
        accessToken : string,
        refreshToken : string,
        user : User
    }
}