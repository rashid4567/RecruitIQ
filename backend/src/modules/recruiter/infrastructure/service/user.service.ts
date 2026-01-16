import { UserServicePort } from "../../application/ports/user.service.port";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { RecruiterProfileDTO } from "../../application/dto/recruiter-profile.dto";

export class UserService implements UserServicePort {
  async updateProfile(userId: string, data: any):Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: data });
  }

  async findUserWithPassWord(userId: string):Promise<{password :string, role : string, authProvider :string} | null> {
     return UserModel.findById(userId).select("+password role authprovider");
   
  } 

  async updatePassword(userId: string, hashedPassword: string) {
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }
}
