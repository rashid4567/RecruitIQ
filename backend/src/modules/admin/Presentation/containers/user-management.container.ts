import { BlockUserUseCase } from "../../Application/use-Cases/user-management/block-user.usecase";
import { UnblockUserUseCase } from "../../Application/use-Cases/user-management/unblock-user.usecase";
import { UserRepository } from "../../Domain/repositories/user.repository";
import { MongooseUserRepository } from "../../Infrastructure/repositories/mongoose-user.repository";
import { BlockUserController } from "../controller/user-management/blockUser.controller";
import { UnblockUserController } from "../controller/user-management/unblock.User.controller";

const userRepo: UserRepository = new MongooseUserRepository();

const blockUserUC = new BlockUserUseCase(userRepo);

const unblockUserUC = new UnblockUserUseCase(userRepo);

export const blockUserController = new BlockUserController(blockUserUC);

export const unblockUserController = new UnblockUserController(unblockUserUC);
