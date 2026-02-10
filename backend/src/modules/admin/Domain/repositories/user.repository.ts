import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";
import { UserAccount } from "../entities/user.entity";

export interface UserRepository{
    findById(id : UserId):Promise<UserAccount| null>;
    findByEmail(email :Email):Promise<UserAccount | null>;
    save(user : UserAccount):Promise<void>

}