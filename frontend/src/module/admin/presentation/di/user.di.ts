
import { BlockUserUseCase } from "../../application/useCases/user-management/blockCanddiate.use-case";
import { UnblockUserUseCase } from "../../application/useCases/user-management/unblockCanddiate.use-case";
import { ApiUserRepository } from "../../infrastructure/repositories/api-user.repository";


const userRepo = new ApiUserRepository();
export const blockUserUC = new BlockUserUseCase(userRepo);
export const unblockUserUC = new UnblockUserUseCase(userRepo);