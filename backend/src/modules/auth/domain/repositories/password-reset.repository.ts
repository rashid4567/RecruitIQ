import { PasswordReset } from "../entities/password-reset.entity";

export interface PassWordResetRepository{
    create(reset:PasswordReset):Promise<void>
    findByToken(token  :string):Promise<PasswordReset>;
    deleteByUserId(userId : string):Promise<void>
}