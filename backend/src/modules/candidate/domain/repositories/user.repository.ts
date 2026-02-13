import { User } from "../entities/user.entity";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

export interface UserRepository {
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(userId: User): Promise<void>;
}
