import { User } from "../entities/user.entity";
import { Email } from "../value.object.ts/email.vo";
import { UserId } from "../value.object.ts/user-Id.vo";

export interface UserRepository{
    findById(userId : UserId):Promise<User | null>;
    findByEmail(email : Email):Promise<User | null>;
    save(userId : User):Promise<void>;
}