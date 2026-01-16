import { PasswordServicePort } from "../ports/password.service.port";
import { UserServicePort } from "../ports/user.service.port";

export class UpdateRecruiterPasswordUserCase{
    constructor(
        private readonly userService : UserServicePort,
        private readonly passwordService : PasswordServicePort,
    ){};

    async execute(
        userId : string,
        currentPassword : string,
        newPassword :string,
    ){
        const user = await this.userService.findUserWithPassWord(userId);

        if(!user)throw new Error("User not found");
        if(user.role !== "recruiter")throw new Error("Unauthorized");
        if(user.authProvider !== "local"){
            throw new Error("Social login password update not allowed")
        }

        const match = await this.passwordService.compare(currentPassword, user.password);
        if(!match)throw new Error("Current password is not correct");
        
        const same = await this.passwordService.compare(user.password, newPassword);
        if(same)throw new Error("New password must be different");

        const hash = await this.passwordService.hash(newPassword);
        await this.userService.updatePassword(userId, hash)
    }
}