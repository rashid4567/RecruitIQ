export interface GoogleAuthResult {
  email: string;
  googleId: string;
  fullName: string;
}

export interface GoogleAuthPort {
  verifyToken(credential: string): Promise<GoogleAuthResult>;
}