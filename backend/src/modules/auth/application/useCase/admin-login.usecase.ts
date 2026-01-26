import { USER_ROLES } from "../../domain/constants/roles.constants";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { LoginUseCase } from "./login.useCase";

export class AdminLoginUseCase {
  constructor(
    private readonly loginUseCase: LoginUseCase
  ) {}

  async execute(
    emailRaw: string,
    passwordRaw: string
  ) {
    const result = await this.loginUseCase.execute(
      emailRaw,
      passwordRaw
    );

    if (result.role !== USER_ROLES.ADMIN) {
      throw new ApplicationError(
        ERROR_CODES.ADMIN_LOGIN_NOT_ALLOWED
      );
    }

    return result;
  }
}
