import type { GoogleRoles } from "../constants/google-role";
import type { UserRole } from "../constants/user-role";
import { AuthUser } from "../entities/AuthUser";
import type { Email } from "../value-object/email.vo";
import type { Password } from "../value-object/password.vo";

export interface AuthRepository {
  login(
    email: Email,
    password: Password,
  ): Promise<{
    accessToken: string;
    user: AuthUser;
  }>;

  googleLogin(
    credential: string,
    role?: GoogleRoles,
  ): Promise<{
    accessToken: string;
    user: AuthUser;
  }>;

  sendOtp(email: Email, role: UserRole): Promise<void>;

  verifyOtpAndRegister(data: {
    email: Email;
    otp: string;
    password: Password;
    fullName: string;
    role: UserRole;
  }): Promise<{
    accessToken: string;
    user: AuthUser;
  }>;

  updatePassword(
    currentPassword: Password,
    newPassword: Password,
  ): Promise<void>;

  forgotPassword(email: Email): Promise<void>;

  resetPassword(token: string, newPassword: Password): Promise<void>;

  requestEmailupdate(newEmail: Email): Promise<void>;

  verifyEmailUpdate( email : Email, otp : string):Promise<void>;

}
