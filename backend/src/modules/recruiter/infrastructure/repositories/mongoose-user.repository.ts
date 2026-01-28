import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.entity";
import { Email } from "../../domain/value.object.ts/email.vo";
import { UserId } from "../../domain/value.object.ts/user-Id.vo";

export class MongooseUserRepository implements UserRepository {
  async findById(userId: UserId): Promise<User | null> {
    const doc = await UserModel.findById(userId.getValue()).lean();
    if (!doc || !doc.fullName) return null;

    return User.fromPresistance({
      id: userId,
      fullName: doc.fullName,
      email: Email.create(doc.email),
      profileImage: doc.profileImage ?? "",
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel.findOne({
      email: email.getValue(),
    }).lean();

    if (!doc || !doc.fullName) return null;

    return User.fromPresistance({
      id: UserId.create(doc._id.toString()),
      fullName: doc.fullName,
      email,
      profileImage: doc.profileImage ?? "",
    });
  }

  async save(user: User): Promise<void> {
    await UserModel.findByIdAndUpdate(
      user.getId().getValue(),
      {
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
      },
      { upsert: false }
    );
  }
}
