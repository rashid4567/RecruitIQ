import { User } from "../entities/user.entity";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getPasswordHash(email: string): Promise<string | null>;
  create(user: User, passwordHash: string): Promise<User>;
}
