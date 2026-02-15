import { Email } from "../../../../shared/value-objects.ts/email.vo.ts";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { UserAccount } from "../entities/user.entity";

export interface UserRepository{
    findById(id : UserId):Promise<UserAccount| null>;
    findByEmail(email :Email):Promise<UserAccount | null>;
    save(user : UserAccount):Promise<void>

}