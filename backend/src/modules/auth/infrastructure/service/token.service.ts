import jwt from "jsonwebtoken";
import { TokenServicePort } from "../../application/ports/token.service";
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
      user,
    };
  }

  generateAccessToken(user: User) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );
  }
  verifyRefreshToken(token :string){
    return jwt.sign(token, process.env.REFRESH_TOKEN_SECRET!)as any
  }
}
