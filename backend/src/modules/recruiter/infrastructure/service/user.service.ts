import { UserServicePort } from "../../application/ports/user.service.port";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";

export class UserService implements UserServicePort {

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      profileImage?: string;
    }
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: data });
  }

  async findUserWithPassWord(
    userId: string
  ): Promise<{ password: string; role: string; authProvider: string } | null> {
    return UserModel.findById(userId).select("+password role authProvider");
  }

  async findUserById(
    userId: string
  ): Promise<{
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    isActive: boolean;
    createdAt: Date;
  } | null> {
    const user = await UserModel.findById(userId).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      fullName: user.fullName ?? "",
      email: user.email,
      profileImage: user.profileImage ?? "",
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async updatePassword(
    userId: string,
    hashedPassword: string
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: { password: hashedPassword },
    });
  }

  async updateEmail(
    userId: string,
    newEmail: string
  ): Promise<void> {
    const normalizedEmail = newEmail.toLowerCase().trim();

    const exists = await UserModel.exists({ email: normalizedEmail });
    if (exists) {
      throw new Error("Email already in use");
    }

    const user = await UserModel.findById(userId).select("authProvider");
    if (!user) {
      throw new Error("User not found");
    }

    if (user.authProvider !== "local") {
      throw new Error("Email update not allowed for social login accounts");
    }

    await UserModel.findByIdAndUpdate(userId, {
      $set: { email: normalizedEmail },
    });
  }
}
