import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserModel } from "../mongoose/model/user.model";

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const u = await UserModel.findOne({ email });
    if (!u) return null;

    return new User(
      u._id.toString(),
      u.email,
      u.role,
      u.fullName ?? "",
      u.isActive ?? true
    );
  }

  async findById(id: string): Promise<User | null> {
    const u = await UserModel.findById(id);
    if (!u) return null;

    return new User(
      u._id.toString(),
      u.email,
      u.role,
      u.fullName ?? "",
      u.isActive ?? true
    );
  }

  async getPasswordHash(email: string): Promise<string | null> {
    const u = await UserModel.findOne({ email }).select("password");
    return u?.password ?? null;
  }

  async create(user: User, passwordHash: string): Promise<User> {
    const doc = await UserModel.create({
      email: user.email,
      password: passwordHash,
      role: user.role,
      fullName: user.fullName,
    });

    return new User(
      doc._id.toString(),
      doc.email,
      doc.role,
      doc.fullName ?? "",
      doc.isActive ?? true
    );
  }
}
