import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { UserServicePort } from "../../application/ports/user.service";

export class UserService implements UserServicePort{
    findByWithPassword(userId: string){
        return UserModel.findById(userId).select("+password");
    }

    async updatePassword(userId : string, password :string){
        await UserModel.findByIdAndUpdate(userId,{password})
    }
}