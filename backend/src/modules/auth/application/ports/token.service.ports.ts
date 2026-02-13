export interface AuthTokenServicePort {
  generateAccessToken(userId: string, role: string): string;
  generateRefreshToken(userId: string): string;
  verifyAccessToken(token: string): { userId: string; role: string };
  verifyRefreshToken(token: string): { userId: string };
   generatePasswordResetToken(userId: string): string;
  verifyPasswordResetToken(token: string): { userId: string };
}


