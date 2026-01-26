import { PasswordHasherPort } from "../../domain/ports/password-hasher.port"; 
import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../domain/value.objects.ts/password.vo";

export class updatePasswordUseCase{
    constructor(
        private readonly userRepo : UserRepository,
        private readonly hasher : PasswordHasherPort,
    ){};

    async execute(userId : string, current : string, next :string):Promise<void>{
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new Error("User not found")
        }
        const updatePassword = await user.updatePassword(
            Password.create(current),
            Password.create(next),
            this.hasher,
        )

        await this.userRepo.save(updatePassword)
    }
    

}