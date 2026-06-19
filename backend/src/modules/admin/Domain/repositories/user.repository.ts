
import { Email } from "../../../auth/domain/value.objects/email.vo";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { UserAccount } from "../entities/user.entity";
import { BaseRepository } from "../../../../shared/repositories/base.repository";

export interface UserRepository extends BaseRepository<UserAccount, UserId> {
  findByEmail(email: Email): Promise<UserAccount | null>;
  save(user: UserAccount): Promise<void>;
}
