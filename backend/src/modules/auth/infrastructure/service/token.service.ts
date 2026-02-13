import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthTokenServicePort } from "../../application/ports/token.service.ports";
import { TOKEN_EXPIRY } from "../constants/token.constants";
import { INFRA_ERRORS } from "../constants/error-messages.constants";


export type AccessTokenPayload = {
  userId: string;
  role: string;
};

type RefreshTokenPayload = {
  userId: string;
};

type PasswordResetTokenPayload = {
  userId: string;
  purpose: "PASSWORD_RESET";
};

export class TokenService implements AuthTokenServicePort {

  generateAccessToken(userId: string, role: string): string {
    const payload: AccessTokenPayload = { userId, role };

    return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: TOKEN_EXPIRY.ACCESS }
    );
  }

  verifyAccessToken(token: string): { userId: string; role: string } {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      throw new Error(INFRA_ERRORS.INVALID_ACCESS_TOKEN);
    }

    return {
      userId: decoded.userId as string,
      role: decoded.role as string,
    };
  }

  generateRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = { userId };

    return jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: TOKEN_EXPIRY.REFRESH }
    );
  }

  verifyRefreshToken(token: string): { userId: string } {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      throw new Error(INFRA_ERRORS.INVALID_REFRESH_TOKEN);
    }

    return { userId: decoded.userId as string };
  }

  generatePasswordResetToken(userId: string): string {
  const payload: PasswordResetTokenPayload = {
    userId,
    purpose: "PASSWORD_RESET",
  };

  return jwt.sign(
    payload,
    process.env.PASSWORD_RESET_SECRET!, 
    { expiresIn: TOKEN_EXPIRY.PASSWORD_RESET }
  );
}



  verifyPasswordResetToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(
      token,
      process.env.PASSWORD_RESET_SECRET!
    ) as JwtPayload;

    if (
      decoded.purpose !== "PASSWORD_RESET" ||
      typeof decoded.userId !== "string"
    ) {
      throw new Error(INFRA_ERRORS.INVALID_PASSWORD_RESET_TOKEN);
    }

    return { userId: decoded.userId };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error(INFRA_ERRORS.PASSWORD_RESET_TOKEN_EXPIRED);
    }

    throw new Error(INFRA_ERRORS.INVALID_PASSWORD_RESET_TOKEN);
  }
}


}
