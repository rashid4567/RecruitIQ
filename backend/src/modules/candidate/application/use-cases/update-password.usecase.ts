import { passwordServicePort } from "../ports/password.service.port";
import { UserServicePort } from "../ports/user.service";

export class updatePasswordUseCase{
    constructor(
        private readonly userService : UserServicePort,
        private readonly passWordService : passwordServicePort,
    ){};

    async execute(userId : string, current : string, next : string){
        const user = await this.userService.findByWithPassword(userId);
        if(user.authProvider !== "local"){
            throw new Error("Social login password update not allowed")
        }
        const match = await this.passWordService.compare(current, user.password);
        if(!match)throw new Error("Invalid current password");
        const hashed = await this.passWordService.hash(next);
        await this.userService.updatePassword(userId, hashed)
    }
}