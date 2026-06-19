import { User } from "../entities/user.entity";
import { Email } from "../valueObject/email.vo";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { BaseRepository } from "../../../../shared/repositories/base.repository";

export interface UserRepository extends BaseRepository<User, UserId> {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
