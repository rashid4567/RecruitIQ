import { UserRepository } from "../../domain/repositories/user.repository";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";

export class MongooseUserRepository implements UserRepository {
  async findById(userId: string) {
    const user = await UserModel.findById(userId).select(
      "fullName email profileImage"
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      fullName: user.fullName ?? "",
      email: user.email,
      profileImage: user.profileImage ?? undefined,
    };
  }

  async findByEmail(email: string) {
    const user = await UserModel.findOne({ email }).select(
      "fullName email profileImage"
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      fullName: user.fullName ?? "",
      email: user.email,
      profileImage: user.profileImage ?? undefined,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      email?: string;
      profileImage?: string;
    }
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
  }
}
