import { USER_ROLES } from "../../../domain/constants/roles.constants";
import { ERROR_CODES } from "../../constants/error-codes.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { LoginUseCase } from "./login.useCase";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { LoginRequestDTO, LoginResponseDTO } from "../../dto/login.dto";

export class AdminLoginUseCase implements UseCase<
  LoginRequestDTO,
  LoginResponseDTO
> {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const result = await this.loginUseCase.execute(input);

    if (result.role !== USER_ROLES.ADMIN) {
      throw new ApplicationError(ERROR_CODES.ADMIN_LOGIN_NOT_ALLOWED);
    }

    return result;
  }
}
