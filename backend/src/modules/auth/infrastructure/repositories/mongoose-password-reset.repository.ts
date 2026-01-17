import { PasswordReset } from "../../domain/entities/password-reset.entity";
import { PassWordResetRepository } from "../../domain/repositories/password-reset.repository";

export class MongoosePasswordResetRepository implements PassWordResetRepository{
    async create(reset : PasswordReset){
        await passwordRestM
    }
}