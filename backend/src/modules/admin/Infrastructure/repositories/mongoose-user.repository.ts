import { Types } from "mongoose";
import { UserRepository } from "../../Domain/repositories/user.repository";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";
import { UserAccount } from "../../Domain/entities/user.entity";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { userDoc } from "../types/user.doc.type";



export class MongooseUserRepository implements UserRepository {
  async findById(id: UserId): Promise<UserAccount | null> {
    if (!Types.ObjectId.isValid(id.getValue())) return null;

    const doc = await UserModel.findById(id.getValue());
    if (!doc) return null;

    return this.toDomain(doc);
  }

  async findByEmail(email: Email): Promise<UserAccount | null> {
    const doc = await UserModel.findOne({
      email: email.getValue(),
    }).lean<userDoc>();

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async save(user: UserAccount): Promise<void> {
    const result = await UserModel.findByIdAndUpdate(
      user.getId().getValue(),
      {
        email: user.getEmail().getValue(),
        isActive: user.isActiveAccount(),
      },
      { new: false },
    );

    if (!result) {
      throw new Error("User not found while saving");
    }
  }

  private toDomain(doc : userDoc):UserAccount{
    return UserAccount.fromPresistence({
        id : UserId.create(doc._id.toString()),
        email : Email.create(doc.email),
        isActive : doc.isActive
    })
  }
}
