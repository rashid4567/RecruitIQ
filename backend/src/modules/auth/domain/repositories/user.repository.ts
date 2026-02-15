import { User } from "../entities/user.entity";
import { Email } from "../../../../shared/value-objects.ts/email.vo";

export interface UserRepository {
  findById(userId : string):Promise<User|null>;
  findByEmail(email : Email):Promise<User | null>;
  save(user: User):Promise<User>
}
