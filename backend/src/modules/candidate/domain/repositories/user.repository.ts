import { User } from "../entities/user.entity";
import { Email } from "../../../../shared/value-objects.ts/email.vo.ts";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";

export interface UserRepository {
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(userId: User): Promise<void>;
}
