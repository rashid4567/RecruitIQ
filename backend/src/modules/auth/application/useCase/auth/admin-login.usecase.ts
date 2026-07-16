import { USER_ROLES } from "../../../domain/constants/roles.constants";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { LoginRequestDTO, LoginResponseDTO } from "../../dto/login.dto";

export class AdminLoginUseCase implements IUseCase<
  LoginRequestDTO,
  LoginResponseDTO
> {
  constructor(private readonly loginUseCase: IUseCase<
  LoginRequestDTO,
  LoginResponseDTO
>) {}

  async execute(input: LoginRequestDTO): Promise<LoginResponseDTO> {
    const result = await this.loginUseCase.execute(input);

    if (result.user.role !== USER_ROLES.ADMIN) {
      throw new ApplicationError(ERROR_CODES.ADMIN_LOGIN_NOT_ALLOWED);
    }

    return result;
  }
}
