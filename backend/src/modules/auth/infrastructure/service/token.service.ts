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

  verifyToken(token: string){
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    )as{
      userId : string,
      role : string,
    }
  }
}
