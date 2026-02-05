import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { UserModel } from "../mongoose/model/user.model";
import { userRoles } from "../../domain/constants/roles.constants";
import { AuthProvider } from "../../../../shared/domain/value-objects.ts/auth-provider.vo";
import { GoogleId } from "../../domain/value.objects.ts/google-id.vo";

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.getValue() }).lean();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId).lean();
    return doc ? this.toDomain(doc) : null;
  }

  async save(user: User): Promise<User> {
    // 🟢 CREATE
    if (!user.id) {
      const doc = await UserModel.create({
        email: user.email.getValue(),
        role: user.role,
        fullName: user.fullName,
        isActive: user.canLogin(),
        authProvider: user.authProvider.getValue(),
        googleId: user.googleId?.getValue(),
        password: user.getPasswordHash() ?? null,
      });

      return this.toDomain(doc);
    }

    // 🟢 UPDATE
    const doc = await UserModel.findByIdAndUpdate(
      user.id,
      {
        email: user.email.getValue(),
        role: user.role,
        fullName: user.fullName,
        isActive: user.canLogin(),
        authProvider: user.authProvider.getValue(),
        googleId: user.googleId?.getValue(),
        password: user.getPasswordHash() ?? null,
      },
      { new: true }
    ).lean();

    if (!doc) {
      throw new Error("User not found while updating");
    }

    return this.toDomain(doc);
  }

  private toDomain(doc: any): User {
    return User.rehydrate({
      id: doc._id.toString(),
      email: Email.create(doc.email),
      role: doc.role as userRoles,
      fullName: doc.fullName,
      isActive: doc.isActive ?? true,
      authProvider:
        doc.authProvider === "google"
          ? AuthProvider.google()
          : AuthProvider.local(),
      passwordHash: doc.password ?? undefined,
      googleId: doc.googleId ? GoogleId.create(doc.googleId) : undefined,
    });
  }
}
