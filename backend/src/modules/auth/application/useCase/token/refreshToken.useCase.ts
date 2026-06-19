import { UserRepository } from "../../../domain/repositories/user.repository";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RefershTokenResponseDTO,
  RefreshTokenRequestDTO,
} from "../../dto/refresh.TokenDTO";

export class RefreshTokenUseCase implements UseCase<
  RefreshTokenRequestDTO,
  RefershTokenResponseDTO
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(
    input: RefreshTokenRequestDTO,
  ): Promise<RefershTokenResponseDTO> {
    if (!input.refreshToken) {
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED);
    }
    const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    const user = await this.userRepo.findById(payload.userId);

    if (!user || !user.canLogin()) {
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    if (!user.id) {
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND);
    }
    return {
      accessToken: this.tokenService.generateAccessToken(user.id, user.role),
    };
  }
}
