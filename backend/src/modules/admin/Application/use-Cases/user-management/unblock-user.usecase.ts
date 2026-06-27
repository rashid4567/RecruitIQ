import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UserRepository } from "../../../Domain/repositories/user.repository";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserStatusRequestDTO } from "../../dto/recruiter.dto/user.status.dto";

export class UnblockUserUseCase implements IUseCase<UserStatusRequestDTO, void> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(request: UserStatusRequestDTO) {
    if (!request.userId || request.userId === "[object Object]") {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }
    const id = UserId.create(request.userId);
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    user.unblock();
    await this.userRepo.save(user);
  }
}
