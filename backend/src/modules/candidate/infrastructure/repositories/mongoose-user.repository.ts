import { UserRepository } from "../../domain/repositories/user.repository";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { User } from "../../domain/entities/user.entity";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { Email } from "../../../../shared/value-objects.ts/email.vo";

export class MongooseUserRepository implements UserRepository {
  async findById(userId: UserId): Promise<User | null> {
    const doc = await UserModel.findById(userId.getValue());
    if (!doc) return null;

    if (!doc.fullName) {
      throw new Error("Corrupted user data");
    }

    return User.fromPersistence({
      id: userId,
      fullName: doc.fullName,
      email: Email.create(doc.email),
      profileImage: doc.profileImage ?? undefined,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.getValue() });
    if (!doc) return null;

    if (!doc.fullName) {
      throw new Error("Corrupted user data");
    }

    return User.fromPersistence({
      id: UserId.create(doc._id.toString()),
      fullName: doc.fullName,
      email,
      profileImage: doc.profileImage ?? undefined,
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
      { upsert: true },
    );
  }
}
