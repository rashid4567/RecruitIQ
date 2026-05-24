import { UserRepository } from "../../domain/repositories/user.repository";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { User } from "../../domain/entities/user.entity";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { Email } from "../../domain/valueObject/email.vo";

export class MongooseUserRepository implements UserRepository {
  async findById(userId: UserId): Promise<User | null> {
    const doc = await UserModel.findById(userId.getValue()).lean();

    if (!doc) return null;

    return User.fromPersistence({
      id: userId,
      fullName: doc.fullName ?? "",
      email: Email.create(doc.email),
      profileImage: doc.profileImage ?? "",
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel
      .findOne({ email: email.getValue() })
      .lean();

    if (!doc) return null;

    return User.fromPersistence({
      id: UserId.create(doc._id.toString()),
      fullName: doc.fullName ?? "",
      email: Email.create(doc.email),
      profileImage: doc.profileImage ?? "",
    });
  }

  async save(user: User): Promise<void> {
    const updated = await UserModel.findByIdAndUpdate(
      user.getId().getValue(),
      {
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new Error("Failed to update user");
    }
  }
}