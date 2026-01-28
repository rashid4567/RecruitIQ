// import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
// import { UserServicePort } from "../../application/ports/user.service.port";

// export class UserService implements UserServicePort{
//     async findByWithPassword(userId: string){
//         return UserModel.findById(userId).select("+password");
//     }

//     async updatePassword(userId : string, password :string){
//         await UserModel.findByIdAndUpdate(userId,{password})
//     }

//     async updateEmail(userId: string, newEmail: string): Promise<void> {
//         const normalizedEmail = newEmail.toLocaleLowerCase().trim();
//         const exists = await UserModel.exists({email : normalizedEmail});
//         if(exists)throw new Error("Email already in use");

//         const user = await UserModel.findById(userId);
//         if(!user)throw new Error("user not found");
//         if(user.authProvider !== "local"){
//             throw new Error("Email update not allowed for the social login")
//         }
//         await UserModel.findByIdAndUpdate(userId,{
//             $set : {email : normalizedEmail}
//         })
//     }
// }