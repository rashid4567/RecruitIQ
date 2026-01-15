import { UserRepository } from "../../domain/repositories/user.repository";
import { GoogleAuthPort } from "../ports/google-auth.ports";
import { TokenServicePort } from "../ports/token.service.ports";
import { ProfileServicePort } from "../ports/profile.service.ports";

export class GoogleLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly googleAuth: GoogleAuthPort,
    private readonly tokenService: TokenServicePort,
    private readonly profileService: ProfileServicePort
  ) {}

  async execute(
    credential: string,
    role?: "candidate" | "recruiter"
  ) {
    const googleUser = await this.googleAuth.verifyToken(credential);

    let user = await this.userRepo.findByEmail(googleUser.email);

  
    if (user && user.authProvider === "local") {
      throw new Error("Email already registered using password login");
    }

  
    if (user && role && user.role !== role) {
      throw new Error(
        `This account is already registered as ${user.role}`
      );
    }

 
    if (user && !user.isActive) {
      throw new Error("Account is deactivated");
    }

    if (!user) {
      if (!role) {
        throw new Error("Role is required for Google signup");
      }

      user = await this.userRepo.createGoogleUser({
        email: googleUser.email,
        googleId: googleUser.googleId,
        fullName: googleUser.fullName,
        role,
      });

      await this.profileService.createProfile(user.id, role);
    }

    const tokens = this.tokenService.generateToken(user);
    return{
        user,
        ...tokens,
    }
  }
}
