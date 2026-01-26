import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";
import { UserId } from "../value-objects/user-id.vo";


export interface UserRepository {
  findById(userId : UserId):Promise<User | null>;
  findByEmail(email : Email):Promise<User | null>;
  save(userId : User):Promise<void>;
}
