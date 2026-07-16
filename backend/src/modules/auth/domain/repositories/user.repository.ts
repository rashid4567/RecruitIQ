import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { User } from "../entities/user.entity";
import { Email } from "../value.objects/email.vo";

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: Email): Promise<User | null>;
  findByIds(userIds: string[]): Promise<User[]>;
  save(user: User): Promise<User>;
}
