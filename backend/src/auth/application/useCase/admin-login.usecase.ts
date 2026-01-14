import { LoginUseCase } from "./login.useCase";

export class AdminLoginUseCase {
    constructor(private readonly loginUseCase : LoginUseCase){};
    async execute(email : string, password : string){
        const result = await this.loginUseCase.execute(email,password)
        if(result.user.role !== "admin")throw new Error("UnAuthorized access");
        return result;
    }
}