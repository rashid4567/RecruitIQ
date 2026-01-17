import jwt from "jsonwebtoken";
import { TokenServicePort } from "../../application/ports/token.service.ports";
import { User } from "../../domain/entities/user.entity";

export class TokenService implements TokenServicePort {
  generateToken(user: User) {
    const payload = {
      userId: user.id,
      role: user.role,
    };

    return {
      accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
      }),
      refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d",
      }),
    };
  }

  generatePasswordResetToken(userId: string): string {
    return jwt.sign(
      {
        userId,
        purpose : "PASSWORD_RESET",
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {expiresIn : "10m"}
    )
  }

  verifyPasswordResetToken(token: string): { userId: string} {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as any;

   if(payload.purpose !== "PASSWORD_RESET"){
    throw new Error("Invalid reset token")
   }
   return {userId : payload.userId}
  }

  verifyToken(token: string){
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    )as{
      userId : string,
      role : string,
    }
  }
}
