import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../domain/value.objects.ts/email.vo";
import { UserModel } from "../mongoose/model/user.model";
import { userRoles } from "../../domain/constants/roles.constants";
import { AuthProvider } from "../../domain/value.objects.ts/auth-provider.vo";
import { GoogleId } from "../../domain/value.objects.ts/google-id.vo";

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: Email): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.getValue() });
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findById(userId: string): Promise<User | null> {
    const doc = await UserModel.findById(userId);
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async save(user: User): Promise<User> {
    const persistence = {
      email: user.email.getValue(),
      role: user.role,
      fullName: user.fullName,
      isActive: user.canLogin(),
      authProvider: user.authProvider.getValue(),
      googleId: user.googleId?.getValue(),
      password: user.getPasswordHash() ?? null,
    };

    const doc = user.id
      await UserModel.findByIdAndUpdate(user.id, persistence, { upsert: false })

      // : await UserModel.create(persistence);

    return this.toDomain(doc);
  }

  private toDomain(doc: any): User {
    return User.rehydrate({
      id: doc._id.toString(),
      email: Email.create(doc.email),
      role: doc.role as userRoles,
      fullName: doc.fullName ?? "",
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
