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



}
