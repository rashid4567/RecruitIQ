import api from "@/api/axios";
import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { AuthUser } from "../../domain/entities/AuthUser";
import type { GoogleRoles } from "../../domain/constants/google-role";
import type { UserRole } from "../../domain/constants/user-role";
import type { Email } from "../../domain/value-object/email.vo";
import type { Password } from "../../domain/value-object/password.vo";
import { email } from "zod";
export class ApiAuthRepository implements AuthRepository {
  async login(email: Email, password: Password) {
    const res = await api.post("/auth/login", {
      email: email.getValue(),
      password: password.getValue(),
    });

    const { accessToken, user } = res.data.data;

    this.persistSession(accessToken, user);

    return {
      accessToken,
      user: new AuthUser(user.id, user.role, user.fullName),
    };
  }

  async googleLogin(credential: string, role?: GoogleRoles) {
    const payload: Record<string, unknown> = { credential };
    if (role) payload.role = role;

    const res = await api.post("/auth/google/login", payload);

    const { accessToken, user } = res.data.data;

    this.persistSession(accessToken, user);

    return {
      accessToken,
      user: new AuthUser(user.id, user.role, user.fullName),
    };
  }

  async sendOtp(email: Email, role: UserRole): Promise<void> {
    await api.post("/auth/send-otp", {
      email: email.getValue(),
      role,
    });
  }

  async verifyOtpAndRegister(data: {
    email: Email;
    otp: string;
    password: Password;
    fullName: string;
    role: UserRole;
  }) {
    const res = await api.post("/auth/verify-otp", {
      email: data.email.getValue(),
      otp: data.otp,
      password: data.password.getValue(),
      fullName: data.fullName,
      role: data.role,
    });

    const { accessToken, user } = res.data.data;

    this.persistSession(accessToken, user);

    return {
      accessToken,
      user: new AuthUser(user.id, user.role, user.fullName),
    };
  }

  async forgotPassword(email: Email): Promise<void> {
    await api.post("/auth/forgot-password", {
      email: email.getValue(),
    });
  }

  async resetPassword(token: string, newPassword: Password): Promise<void> {
    await api.post("/auth/reset-password", {
      token,
      password: newPassword.getValue(),
    });
  }

  private persistSession(
    accessToken: string,
    user: { id: string; role: UserRole; fullName?: string },
  ) {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userRole", user.role);

    if (user.fullName) {
      localStorage.setItem("userFullName", user.fullName);
    }
  }

  async updatePassword(
    currentPassword: Password,
    newPassword: Password,
  ): Promise<void> {
    await api.post("/auth/update-password", {
      currentPassword: currentPassword.getValue(),
      newPassword: newPassword.getValue(),
    });
  }

  async requestEmailupdate(newEmail: Email): Promise<void> {
    await api.post("auth/email/request-otp", { email: newEmail.getValue() });
  }

  async verifyEmailUpdate(email: Email, otp: string): Promise<void> {
    await api.post("/auth/email/request-otp",{
      email : email.getValue(),
      otp,
    })
  }
}
