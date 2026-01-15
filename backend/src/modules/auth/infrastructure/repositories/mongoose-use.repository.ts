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
      u.isActive ?? true,
      u.authProvider ?? "local",
      u.googleId ?? undefined
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
      u.isActive ?? true,
      u.authProvider ?? "local",
      u.googleId ?? undefined
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
      authProvider: "local"
    });

    return new User(
      doc._id.toString(),
      doc.email,
      doc.role,
      doc.fullName ?? "",
      doc.isActive ?? true,
      doc.authProvider,
      doc.googleId ?? undefined
    );
  }

  async createGoogleUser(input: {
    email: string;
    googleId: string;
    fullName: string;
    role: "candidate" | "recruiter";
  }): Promise<User> {
    const doc = await UserModel.create({
      email: input.email,
      role: input.role,
      fullName: input.fullName,
      authProvider: "google",
      googleId: input.googleId,
      password: null
    });

    return new User(
      doc._id.toString(),
      doc.email,
      doc.role,
      doc.fullName ?? "",
      doc.isActive ?? true,
      doc.authProvider,
      doc.googleId ?? undefined
    );
  }
}
